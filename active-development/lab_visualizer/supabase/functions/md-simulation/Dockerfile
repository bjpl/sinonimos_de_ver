# Dockerfile for OpenMM Simulation Worker
# Multi-stage build for optimized container size

# Stage 1: Conda environment with OpenMM
FROM continuumio/miniconda3:latest AS builder

# Install OpenMM and dependencies
RUN conda install -c conda-forge \
    openmm=8.1.1 \
    python=3.11 \
    numpy \
    && conda clean -afy

# Stage 2: Deno runtime with Python support
FROM denoland/deno:1.40.0

# Install Python and copy conda environment
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Copy OpenMM from builder stage
COPY --from=builder /opt/conda /opt/conda

# Set environment variables
ENV PATH="/opt/conda/bin:${PATH}"
ENV PYTHONPATH="/opt/conda/lib/python3.11/site-packages"

# Create app directory
WORKDIR /app

# Copy OpenMM runner script
COPY openmm-runner.py /app/openmm-runner.py
RUN chmod +x /app/openmm-runner.py

# Copy Edge Function
COPY index.ts /app/index.ts

# Cache Deno dependencies
RUN deno cache /app/index.ts

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD deno eval "fetch('http://localhost:8000/health').then(r => r.ok ? Deno.exit(0) : Deno.exit(1))"

# Run Edge Function
CMD ["deno", "run", "--allow-all", "/app/index.ts"]
