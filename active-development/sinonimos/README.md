# Sinónimos - Spanish Synonym Learning Platform

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/brandonjplambert/sinonimos)
[![Node](https://img.shields.io/badge/Node-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

**Status**: Active Development | **Version**: 1.0.0 | **Stack**: Node.js, Jest, Edge TTS, Unsplash API

An automated platform for generating beautiful, interactive Spanish synonym learning sites with AI-powered content generation, contextual imagery, and native pronunciation audio.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technical Overview](#technical-overview)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

Sinónimos is an automated site generator that creates comprehensive Spanish language learning resources. It produces standalone educational websites for Spanish verb synonyms, complete with contextual imagery, native audio pronunciation, and interactive learning features.

### What It Does

- Generates complete, standalone synonym learning websites for any Spanish verb
- Provides AI-powered synonym generation with cultural context
- Downloads contextual images from Unsplash with proper attribution
- Creates native Spanish audio using Microsoft Edge TTS with LATAM Spanish voices
- Builds interactive, responsive learning interfaces

### Portfolio Context

This project demonstrates expertise in:
- Educational technology development
- Multi-service API integration (Anthropic, Unsplash, Edge TTS)
- Automated content generation and processing
- Accessibility-focused web development
- Spanish language education tools

## Features

### Content Generation
- **AI-Powered Synonyms**: Automated synonym generation using Claude AI with linguistic accuracy
- **Rich Definitions**: Comprehensive explanations with formality levels, contexts, and regional usage
- **Cultural Notes**: LATAM Spanish cultural context and usage patterns
- **Example Sentences**: Contextual examples for each synonym

### Media Integration
- **Contextual Images**: Automatic download from Unsplash with smart query construction
- **Native Audio**: LATAM Spanish pronunciation using 8 different regional voices
- **Attribution Tracking**: Automatic credit generation for images and audio sources

### Technical Features
- **Parallel Processing**: Concurrent image and audio generation for optimal performance
- **Template Engine**: Customizable HTML/CSS templates for generated sites
- **Interactive CLI**: User-friendly command-line interface for configuration
- **Web UI**: Browser-based interface for non-technical users
- **Complete Sites**: Generated sites are fully standalone with zero dependencies

## Technical Overview

### Technology Stack

**Core**:
- Node.js 18+ (ECMAScript modules)
- Jest 29.7+ (testing framework)

**APIs & Services**:
- Anthropic Claude API (content generation)
- Unsplash API (contextual imagery)
- Microsoft Edge TTS (audio synthesis)

**Testing**:
- Jest with ES module support
- Unit, integration, and E2E test coverage
- Automated test suites

### Architecture

```
Content Request
    │
    ├─> AI Generation (optional)
    │   └─> Claude API → Synonym data with context
    │
    ├─> Image Processing
    │   ├─> Context-aware Unsplash queries
    │   ├─> Parallel image downloads
    │   └─> Attribution tracking
    │
    ├─> Audio Generation
    │   ├─> Edge TTS synthesis
    │   ├─> Multi-voice cycling (8 LATAM voices)
    │   └─> Verb + example pronunciation
    │
    └─> Site Assembly
        ├─> Template rendering
        ├─> Asset organization
        ├─> Documentation generation
        └─> Complete standalone site
```

## Quick Start

<details>
<summary>Installation and Setup</summary>

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Python 3.x (for Edge TTS)
- Unsplash API key (required)
- Anthropic API key (optional, for AI generation)

### Installation

```bash
# Clone the repository
git clone https://github.com/brandonjplambert/sinonimos.git
cd sinonimos

# Install Node dependencies
npm install

# Install Python dependencies for audio
pip3 install edge-tts

# Configure environment variables
cd generator
cp .env.example .env
# Edit .env and add your API keys
```

### Configuration

Create `.env` file in the `generator/` directory:

```env
UNSPLASH_ACCESS_KEY=your_unsplash_key_here  # Required
ANTHROPIC_API_KEY=your_anthropic_key_here   # Optional (for AI generation)
```

</details>

## Project Structure

```
sinonimos/
├── generator/              # Site generator application
│   ├── src/               # Generator source code
│   │   ├── core/          # Template engine, site builder
│   │   ├── services/      # AI, audio, image services
│   │   ├── cli/           # Command-line interface
│   │   └── ui/            # Web interface
│   ├── config/            # Configuration and templates
│   ├── scripts/           # Build and utility scripts
│   ├── templates/         # Site templates
│   └── tests/             # Test suites
├── tests/                 # Root-level tests
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
├── docs/                  # Documentation
└── output/               # Generated sites (gitignored)
```

## Usage

### Interactive CLI (Recommended)

```bash
cd generator
npm start
```

Follow the prompts to configure and generate your site.

### Web Interface

```bash
cd generator
npm run ui
```

Open `http://localhost:3000` for a graphical interface.

### Command Line

```bash
cd generator

# Generate with provided synonym data
npm run generate -- -v comer -f ./data/comer_synonyms.json -o ./output

# Generate with AI (requires Anthropic API key)
npm run generate -- -v pensar --ai --count 10 -o ./output

# Use existing project as template
npm run generate -- -v hablar -f ../../sinonimos_de_hablar/data/synonyms.json
```

### Example: Generate "comer" (to eat) site

```bash
cd generator
npm run generate -- -v comer --ai --count 12 -o ./sites
```

This creates a complete learning site at `./sites/comer_site/` with:
- Interactive HTML interface
- 12 AI-generated synonyms
- Contextual images from Unsplash
- Native audio pronunciations
- Example sentences with audio
- Cultural usage notes

## Development

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test suites
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests only
npm run test:e2e           # End-to-end tests only
```

### Development Workflow

1. Make changes to source code in `generator/src/`
2. Run tests to verify changes
3. Test locally by generating a site
4. Commit with descriptive messages

### Project Standards

- ES modules (not CommonJS)
- Jest for all testing
- Professional neutral documentation
- Comprehensive test coverage
- Clear code organization

## Testing

The project includes comprehensive test coverage:

- **Unit Tests**: Individual function and module testing
- **Integration Tests**: Service integration verification
- **E2E Tests**: Complete site generation workflows

Test configuration uses ES module support:
```json
{
  "scripts": {
    "test": "NODE_OPTIONS=--experimental-vm-modules jest"
  }
}
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/enhancement`)
3. Write tests for new functionality
4. Ensure all tests pass (`npm test`)
5. Commit changes with clear messages
6. Push to your fork
7. Open a Pull Request

## License

ISC License - See LICENSE file for details.

## Acknowledgments

- **Unsplash**: Contextual imagery
- **Microsoft Edge TTS**: Audio synthesis
- **Anthropic Claude**: AI content generation
- **Original Sites**: Design inspiration from sinonimos_de_ver, sinonimos_de_caminar, sinonimos_de_hablar

---

For detailed generator documentation, see [generator/README.md](generator/README.md)
