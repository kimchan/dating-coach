# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.0.0] - 2025-09-15

### Added
- Initial release of Kim's Dating Coach application
- AI-powered dating bio analysis using LLM
- Real-time feedback with scoring system (0-100)
- Detailed strengths and improvement suggestions
- Recommended bio rewrite feature
- Copy to clipboard functionality
- Refresh to generate new variations

### Fixed
- Hydration errors in BioAnalyzer component
- Environment variable loading issues
- Mock data fallback for LLM rate limiting

### Changed
- Refresh functionality now uses actual LLM instead of mock data
- Improved error handling and logging
- Enhanced UI/UX with responsive design
- Better feedback structure with detailed analysis

## [0.1.0] - 2025-09-10

### Added
- Initial project setup
- Basic BioAnalyzer component
- OpenRouter LLM integration
- Mock data for testing
- Basic UI layout

### Known Issues
- Hydration errors in client-side rendering
- Inconsistent environment variable loading
- Refresh button using mock data instead of LLM