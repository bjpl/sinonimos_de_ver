#!/usr/bin/env python3
"""
OpenMM Simulation Runner
Executes molecular dynamics simulations with progress reporting
"""

import sys
import json
import logging
from pathlib import Path
from typing import Dict, List, Tuple

try:
    from openmm import *
    from openmm.app import *
    from openmm.unit import *
except ImportError:
    print("ERROR: OpenMM not installed. Install with: conda install -c conda-forge openmm", file=sys.stderr)
    sys.exit(1)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ProgressReporter:
    """Custom reporter for progress tracking"""

    def __init__(self, log_file: Path, total_steps: int, report_interval: int = 100):
        self.log_file = log_file
        self.total_steps = total_steps
        self.report_interval = report_interval
        self.step = 0

    def __call__(self, simulation):
        """Report progress"""
        self.step += self.report_interval
        with open(self.log_file, 'a') as f:
            f.write(f"Step {self.step} of {self.total_steps}\n")

        state = simulation.context.getState(getEnergy=True)
        energy = state.getPotentialEnergy()
        logger.info(f"Progress: {self.step}/{self.total_steps} - Energy: {energy}")

class EnergyReporter:
    """Custom reporter for energy data"""

    def __init__(self, report_interval: int = 100):
        self.report_interval = report_interval
        self.frames = []
        self.temperatures = []

    def __call__(self, simulation):
        """Collect energy data"""
        state = simulation.context.getState(getEnergy=True, getPositions=False)

        potential_energy = state.getPotentialEnergy().value_in_unit(kilojoules_per_mole)
        kinetic_energy = state.getKineticEnergy().value_in_unit(kilojoules_per_mole)
        total_energy = potential_energy + kinetic_energy

        # Calculate temperature from kinetic energy
        # KE = (3/2) * N * k * T
        # For simulation, use state temperature if available
        temperature = 2.0 * kinetic_energy / (3.0 * 8.314e-3 * simulation.system.getNumParticles())

        self.frames.append({
            'step': simulation.currentStep,
            'time': simulation.currentStep * simulation.integrator.getStepSize().value_in_unit(picoseconds),
            'potential': potential_energy,
            'kinetic': kinetic_energy,
            'total': total_energy,
            'temperature': temperature
        })

        self.temperatures.append(temperature)

def setup_system(pdb: PDBFile, config: Dict) -> Tuple[System, Integrator]:
    """Setup OpenMM system with forcefield and integrator"""

    logger.info(f"Setting up system with {pdb.topology.getNumAtoms()} atoms")

    # Choose forcefield
    # For proteins: AMBER14
    # For general molecules: GAFF
    forcefield = ForceField('amber14-all.xml', 'amber14/tip3p.xml')

    # Create system
    system = forcefield.createSystem(
        pdb.topology,
        nonbondedMethod=PME,
        nonbondedCutoff=1.0*nanometers,
        constraints=HBonds,
        rigidWater=True
    )

    # Setup integrator based on ensemble
    ensemble = config['ensemble']
    temperature = config['temperature'] * kelvin
    timestep = config['timestep'] * femtoseconds

    if ensemble == 'NVE':
        # Constant energy - Verlet integrator
        integrator = VerletIntegrator(timestep)

    elif ensemble == 'NVT':
        # Constant temperature - Langevin integrator
        friction = 1.0 / picoseconds
        integrator = LangevinIntegrator(temperature, friction, timestep)

    elif ensemble == 'NPT':
        # Constant pressure and temperature
        friction = 1.0 / picoseconds
        pressure = 1.0 * bar
        integrator = LangevinIntegrator(temperature, friction, timestep)

        # Add barostat for pressure control
        system.addForce(MonteCarloBarostat(pressure, temperature))

    else:
        raise ValueError(f"Unsupported ensemble: {ensemble}")

    logger.info(f"System setup complete - Ensemble: {ensemble}, T: {temperature}, dt: {timestep}")

    return system, integrator

def energy_minimization(simulation: Simulation, max_iterations: int = 1000):
    """Perform energy minimization"""
    logger.info("Starting energy minimization...")

    initial_state = simulation.context.getState(getEnergy=True)
    initial_energy = initial_state.getPotentialEnergy()
    logger.info(f"Initial potential energy: {initial_energy}")

    simulation.minimizeEnergy(maxIterations=max_iterations)

    final_state = simulation.context.getState(getEnergy=True)
    final_energy = final_state.getPotentialEnergy()
    logger.info(f"Final potential energy: {final_energy}")
    logger.info(f"Energy change: {final_energy - initial_energy}")

def equilibration(simulation: Simulation, steps: int, temperature: float):
    """Equilibration phase"""
    logger.info(f"Starting equilibration for {steps} steps...")

    # Set velocities to target temperature
    simulation.context.setVelocitiesToTemperature(temperature * kelvin)

    # Run equilibration
    simulation.step(steps)

    logger.info("Equilibration complete")

def production_run(simulation: Simulation, config: Dict, energy_reporter: EnergyReporter, progress_reporter: ProgressReporter):
    """Production MD run"""
    total_steps = config['total_steps']
    output_frequency = config['output_frequency']

    logger.info(f"Starting production run for {total_steps} steps...")

    # Run simulation with reporters
    for i in range(0, total_steps, output_frequency):
        simulation.step(output_frequency)
        energy_reporter(simulation)
        progress_reporter(simulation)

    logger.info("Production run complete")

def run_simulation(config_path: Path):
    """Main simulation workflow"""

    # Load configuration
    with open(config_path) as f:
        config = json.load(f)

    logger.info(f"Starting simulation with config: {config}")

    # Load structure
    pdb = PDBFile(config['input_pdb'])
    logger.info(f"Loaded structure from {config['input_pdb']}")

    # Setup system
    system, integrator = setup_system(pdb, config)

    # Create simulation
    platform = Platform.getPlatformByName('CPU')  # Use CPU for portability
    simulation = Simulation(pdb.topology, system, integrator, platform)
    simulation.context.setPositions(pdb.positions)

    # Setup reporters
    dcd_reporter = DCDReporter(config['output_dcd'], config['output_frequency'])
    simulation.reporters.append(dcd_reporter)

    energy_reporter = EnergyReporter(config['output_frequency'])
    progress_reporter = ProgressReporter(Path(config['log_file']), config['total_steps'], config['output_frequency'])

    # Energy minimization
    energy_minimization(simulation)

    # Equilibration (10% of total steps)
    equilibration_steps = config['total_steps'] // 10
    equilibration(simulation, equilibration_steps, config['temperature'])

    # Production run
    production_run(simulation, config, energy_reporter, progress_reporter)

    # Save final state
    final_positions = simulation.context.getState(getPositions=True).getPositions()
    final_pdb_path = Path(config['output_dcd']).parent / 'final_state.pdb'
    with open(final_pdb_path, 'w') as f:
        PDBFile.writeFile(pdb.topology, final_positions, f)

    logger.info(f"Final state saved to {final_pdb_path}")

    # Save energy data
    energy_data = {
        'frames': energy_reporter.frames,
        'average_temperature': sum(energy_reporter.temperatures) / len(energy_reporter.temperatures) if energy_reporter.temperatures else 0,
        'final_temperature': energy_reporter.temperatures[-1] if energy_reporter.temperatures else 0,
        'total_frames': len(energy_reporter.frames)
    }

    with open(config['energy_json'], 'w') as f:
        json.dump(energy_data, f, indent=2)

    logger.info(f"Energy data saved to {config['energy_json']}")
    logger.info("Simulation complete!")

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: openmm-runner.py <config.json>", file=sys.stderr)
        sys.exit(1)

    config_path = Path(sys.argv[1])

    if not config_path.exists():
        print(f"ERROR: Config file not found: {config_path}", file=sys.stderr)
        sys.exit(1)

    try:
        run_simulation(config_path)
    except Exception as e:
        logger.error(f"Simulation failed: {e}", exc_info=True)
        sys.exit(1)
