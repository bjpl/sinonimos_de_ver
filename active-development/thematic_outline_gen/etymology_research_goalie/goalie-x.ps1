# GOALIE-X Windows Setup Script
# Complete replacement for GOALIE's query generation
# Based on rUv's architecture

param(
    [Parameter(Position=0)]
    [string]$Action = "help",
    
    [Parameter(Position=1)]
    [string]$Query = "",
    
    [string]$Model = "sonar-pro",
    [string]$Mode = "academic",
    [string]$Output = ".research",
    [switch]$Debug
)

$ErrorActionPreference = "Stop"

# Configuration
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$GOALIE_X_PATH = Join-Path $SCRIPT_DIR "goalie-x.mjs"
$ENV_FILE = Join-Path $SCRIPT_DIR ".env"

# Colors for output
function Write-Header {
    param($Text)
    Write-Host "`n$Text" -ForegroundColor Cyan
    Write-Host ("=" * $Text.Length) -ForegroundColor Cyan
}

function Write-Success {
    param($Text)
    Write-Host "✅ $Text" -ForegroundColor Green
}

function Write-Error {
    param($Text)
    Write-Host "❌ $Text" -ForegroundColor Red
}

function Write-Info {
    param($Text)
    Write-Host "ℹ️  $Text" -ForegroundColor Yellow
}

# Check Node.js installation
function Test-NodeInstallation {
    try {
        $nodeVersion = node --version
        Write-Success "Node.js found: $nodeVersion"
        return $true
    }
    catch {
        Write-Error "Node.js not found. Please install Node.js 18+ from https://nodejs.org"
        return $false
    }
}

# Install dependencies
function Install-Dependencies {
    Write-Header "Installing Dependencies"
    
    Set-Location $SCRIPT_DIR
    
    if (Test-Path "node_modules") {
        Write-Info "Dependencies already installed"
    }
    else {
        Write-Info "Installing npm packages..."
        npm install
        Write-Success "Dependencies installed"
    }
}

# Setup environment
function Setup-Environment {
    Write-Header "Setting Up Environment"
    
    # Check for API key
    if (-not $env:PERPLEXITY_API_KEY) {
        if (Test-Path $ENV_FILE) {
            Write-Info "Loading .env file..."
            Get-Content $ENV_FILE | ForEach-Object {
                if ($_ -match '^([^=]+)=(.*)$') {
                    [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2])
                }
            }
        }
        else {
            Write-Error "PERPLEXITY_API_KEY not set!"
            $apiKey = Read-Host "Enter your Perplexity API key"
            
            if ($apiKey) {
                # Save to .env file
                "PERPLEXITY_API_KEY=$apiKey" | Out-File $ENV_FILE -Encoding UTF8
                [System.Environment]::SetEnvironmentVariable("PERPLEXITY_API_KEY", $apiKey)
                Write-Success "API key saved to .env file"
            }
            else {
                throw "API key is required"
            }
        }
    }
    
    # Set optimization variables
    $env:GOAP_MAX_REPLANS = "5"
    $env:GOAP_CACHE_TTL = "7200"
    
    Write-Success "Environment configured"
}

# Run GOALIE-X
function Invoke-GoalieX {
    param(
        [string]$Command,
        [string]$Query,
        [hashtable]$Options = @{}
    )
    
    $args = @($Command, "`"$Query`"")
    
    foreach ($key in $Options.Keys) {
        $args += "--$key"
        $args += $Options[$key]
    }
    
    if ($Debug) {
        Write-Info "Executing: node $GOALIE_X_PATH $($args -join ' ')"
    }
    
    $process = Start-Process -FilePath "node" `
        -ArgumentList (@($GOALIE_X_PATH) + $args) `
        -NoNewWindow `
        -PassThru `
        -Wait
    
    return $process.ExitCode
}

# Main actions
switch ($Action) {
    "install" {
        Write-Header "GOALIE-X Installation"
        
        if (-not (Test-NodeInstallation)) {
            exit 1
        }
        
        Install-Dependencies
        Setup-Environment
        
        Write-Success "Installation complete!"
        Write-Info "Run '.\goalie-x.ps1 test' to verify installation"
    }
    
    "test" {
        Write-Header "Testing GOALIE-X"
        
        Setup-Environment
        
        # Test analysis
        Write-Info "Testing query analysis..."
        node $GOALIE_X_PATH analyze "etymology and cultural history of autodidactic learning"
        
        Write-Success "Test complete!"
    }
    
    "search" {
        if (-not $Query) {
            Write-Error "Query is required for search"
            exit 1
        }
        
        Write-Header "GOALIE-X Intelligent Search"
        Setup-Environment
        
        $options = @{
            "model" = $Model
            "mode" = $Mode
            "output" = $Output
            "format" = "both"
        }
        
        Invoke-GoalieX -Command "search" -Query $Query -Options $options
    }
    
    "direct" {
        if (-not $Query) {
            Write-Error "Queries are required for direct search"
            exit 1
        }
        
        Write-Header "GOALIE-X Direct Search"
        Setup-Environment
        
        # Split query by semicolons for multiple queries
        $queries = $Query -split ';' | ForEach-Object { $_.Trim() }
        
        $args = @("direct") + ($queries | ForEach-Object { "`"$_`"" })
        $args += @("--model", $Model, "--mode", $Mode)
        
        & node $GOALIE_X_PATH $args
    }
    
    "analyze" {
        if (-not $Query) {
            Write-Error "Query is required for analysis"
            exit 1
        }
        
        Write-Header "Query Analysis"
        Setup-Environment
        
        node $GOALIE_X_PATH analyze "`"$Query`""
    }
    
    "etymology" {
        Write-Header "Etymology Research Suite"
        Setup-Environment
        
        Write-Info "Running comprehensive etymology research..."
        
        # Run the optimized etymology queries
        $etymologyQueries = @(
            "autodidact didaktikos Greek didaskein teaching autos self etymology",
            "autodidactus Latin medieval scholarly tradition etymology",
            "autodidact Proto-Indo-European dek receive linguistic roots",
            "self-taught multilingual etymology comparative linguistics",
            "autodidactic semantic shift historical meaning evolution"
        )
        
        $args = @("direct") + ($etymologyQueries | ForEach-Object { "`"$_`"" })
        $args += @("--model", "sonar-pro", "--mode", "academic")
        
        & node $GOALIE_X_PATH $args
        
        Write-Success "Etymology research complete!"
        Write-Info "Results saved to $Output/"
    }
    
    "cultural" {
        Write-Header "Cultural History Research Suite"
        Setup-Environment
        
        Write-Info "Running comprehensive cultural history research..."
        
        $culturalQueries = @(
            "autodidactic ancient Greek paideia Roman education cultural history",
            "autodidactic medieval monasteries Islamic madrasah Jewish yeshiva",
            "autodidactic Renaissance humanism Enlightenment Bildung",
            "autodidactic Confucian self-cultivation Buddhist traditions",
            "autodidactic indigenous knowledge systems oral traditions"
        )
        
        $args = @("direct") + ($culturalQueries | ForEach-Object { "`"$_`"" })
        $args += @("--model", "sonar-pro", "--mode", "academic")
        
        & node $GOALIE_X_PATH $args
        
        Write-Success "Cultural research complete!"
    }
    
    "full" {
        Write-Header "Full Autodidactic Research Suite"
        Setup-Environment
        
        Write-Info "Running complete research battery..."
        
        # Run intelligent search
        node $GOALIE_X_PATH search "etymology and cultural history of autodidactic learning" `
            --model sonar-pro --mode academic --output $Output
        
        Write-Success "Full research complete!"
        Write-Info "Check $Output/ for comprehensive results"
    }
    
    "compare" {
        Write-Header "Comparing GOALIE vs GOALIE-X"
        
        Write-Info "GOALIE Default Behavior:"
        Write-Host "  1. [your query]" -ForegroundColor Gray
        Write-Host "  2. [your query] research" -ForegroundColor Gray
        Write-Host "  3. [your query] latest developments" -ForegroundColor Gray
        
        Write-Info "`nGOALIE-X Intelligent Queries:"
        node $GOALIE_X_PATH analyze "etymology and cultural history of autodidactic learning" | Out-Host
    }
    
    default {
        Write-Header "GOALIE-X: Enhanced Research Assistant"
        
        Write-Host @"

Complete replacement for GOALIE's query generation
Based on rUv's architecture for intelligent research

USAGE:
    .\goalie-x.ps1 <action> [query] [options]

ACTIONS:
    install     - Install dependencies and setup environment
    test        - Test installation with sample query
    search      - Run intelligent multi-query search
    direct      - Run direct queries (semicolon-separated)
    analyze     - Analyze query without executing
    etymology   - Run complete etymology research suite
    cultural    - Run cultural history research suite
    full        - Run complete autodidactic research
    compare     - Compare GOALIE vs GOALIE-X output

OPTIONS:
    -Model      - Perplexity model (sonar/sonar-pro/sonar-deep-research)
    -Mode       - Search mode (academic/web)
    -Output     - Output directory (default: .research)
    -Debug      - Show debug information

EXAMPLES:
    # First time setup
    .\goalie-x.ps1 install

    # Run intelligent search
    .\goalie-x.ps1 search "autodidactic learning etymology"

    # Run direct queries
    .\goalie-x.ps1 direct "autodidact etymology;self-taught traditions"

    # Analyze query generation
    .\goalie-x.ps1 analyze "etymology and cultural history"

    # Run full research suite
    .\goalie-x.ps1 full

BENEFITS OVER STANDARD GOALIE:
    ✅ Generates 5-10 specialized queries instead of 3 generic ones
    ✅ Domain-aware query decomposition
    ✅ No timeout issues (handles long-running searches)
    ✅ Academic mode for scholarly sources
    ✅ Intelligent synthesis of results
    ✅ Multiple output formats

This is what rUv did - complete control over the pipeline!
"@
    }
}
