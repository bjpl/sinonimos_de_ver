#!/bin/bash

# GOALIE Enhanced Etymology Research Script
# Uses custom plugin to generate intelligent queries

echo "🎯 GOALIE Etymology & Cultural History Research Tool"
echo "=================================================="
echo ""

# Check if PERPLEXITY_API_KEY is set
if [ -z "$PERPLEXITY_API_KEY" ]; then
    echo "❌ Error: PERPLEXITY_API_KEY not set"
    echo "Please run: export PERPLEXITY_API_KEY='your-key-here'"
    exit 1
fi

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Export the plugin path
export GOAP_PLUGINS="${SCRIPT_DIR}/etymology-research-plugin.js"

# Set other optimizations
export GOAP_MAX_REPLANS=5              # Allow more replanning attempts
export GOAP_CACHE_TTL=7200             # Cache results for 2 hours
export GOAP_DEBUG=true                 # Enable debug output to see plugin working

echo "✅ Custom Etymology Plugin Loaded"
echo "📍 Plugin Path: $GOAP_PLUGINS"
echo ""

# Function to run enhanced search
run_enhanced_search() {
    local query="$1"
    echo "🔍 Running Enhanced Search: $query"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Run with increased timeout and custom plugin
    timeout 120 goalie search "$query" \
        --model sonar-pro \
        --max-results 15 \
        --output "./.etymology-research" \
        --format both \
        --no-subfolder
        
    if [ $? -eq 124 ]; then
        echo "⚠️  Search timed out after 120 seconds"
        echo "💡 Tip: Try a simpler query or use 'goalie raw' command"
    fi
}

# Function to run raw search with custom queries
run_raw_search() {
    echo "🔬 Running Raw Search with Optimized Queries"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    goalie raw \
        "autodidact etymology Greek didaktikos didaskein teaching" \
        "self-taught cultural history worldwide traditions" \
        "autodidactic learning Renaissance Enlightenment modern" \
        "Proto-Indo-European dek receive autodidactus Latin" \
        "Islamic ijazah Chinese zixue Japanese dokugaku autodidactic" \
        --max-results 20 \
        --mode academic
}

# Function to explain the plan
explain_plan() {
    local query="$1"
    echo "📋 Explaining GOAP Plan for: $query"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    goalie explain "$query" --steps --reasoning
}

# Main menu
echo "Choose an option:"
echo "1) Enhanced Search (with plugin)"
echo "2) Raw Search (bypasses GOAP)"
echo "3) Explain Plan (see what GOAP will do)"
echo "4) Custom Query"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        run_enhanced_search "etymology and cultural history of autodidactic learning"
        ;;
    2)
        run_raw_search
        ;;
    3)
        explain_plan "etymology and cultural history of autodidactic learning"
        ;;
    4)
        read -p "Enter your custom query: " custom_query
        run_enhanced_search "$custom_query"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Research Complete!"
echo ""

# Show saved files if they exist
if [ -d "./.etymology-research" ]; then
    echo "📁 Output files:"
    ls -la ./.etymology-research/
fi
