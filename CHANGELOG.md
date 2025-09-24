# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2024-01-01

### Added
- Initial version of Live Audio application
- Basic audio visualization with Three.js
- Gemini API integration
- Vite build system
- TypeScript configuration
- Docker containerization support
- Deployment scripts
- Version control setup

### Technical Details
- Built with TypeScript and Lit components
- Uses Three.js for 3D visualizations
- Integrated with Google Gemini API
- Production-ready Docker configuration
- Health checks and monitoring

### Deployment
- Local development: `npm run dev`
- Production build: `npm run build`
- Docker deployment: `docker-compose up -d`
- Server deployment: Use `deploy.sh` script