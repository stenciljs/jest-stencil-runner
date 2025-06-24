# Changelog

All notable changes to this project will be documented in this file.

## **Unreleased**&emsp;<sub><sup>2025-06-24 ([71903a8...ade75da](https://github.com/stenciljs/jest-stencil-runner/compare/71903a8...ade75da?diff=split))</sup></sub>

### Added

- Added comprehensive VSCode workspace configuration for improved development experience
  - TypeScript settings with auto-imports and inlay hints
  - ESLint configuration for both main package and example workspace
  - Jest testing configuration with proper root path setup
  - File associations and language settings for TypeScript/TSX files
  - Prettier formatting on save with ESLint integration
  - Optimized file explorer and search exclusions
  - Terminal and package manager settings for pnpm

### Changed

- Enhanced Stencil environment typing for better type safety

<br>

## **0.0.5**&emsp;<sub><sup>2025-06-24 ([d62b8b9...71903a8](https://github.com/stenciljs/jest-stencil-runner/compare/d62b8b9...71903a8?diff=split))</sup></sub>

### Fixed

- Optimized preprocessor performance and reliability
- Updated example documentation section for better clarity

### Changed

- Improved code formatting and linting setup with Prettier and ESLint integration

<br>

## **0.0.4**&emsp;<sub><sup>2025-06-24 ([3f9155b...d62b8b9](https://github.com/stenciljs/jest-stencil-runner/compare/3f9155b...d62b8b9?diff=split))</sup></sub>

### Fixed

- Added missing repository field to package.json for proper npm registry linking

<br>

## **0.0.3**&emsp;<sub><sup>2025-06-24 ([c8e5619...3f9155b](https://github.com/stenciljs/jest-stencil-runner/compare/c8e5619...3f9155b?diff=split))</sup></sub>

### Fixed

- Configured publishConfig for public access on npm registry

<br>

## **0.0.2**&emsp;<sub><sup>2025-06-24 ([fda3ad1...c8e5619](https://github.com/stenciljs/jest-stencil-runner/compare/fda3ad1...c8e5619?diff=split))</sup></sub>

### Fixed

- Resolved CI/CD release pipeline configuration issues

<br>

## **0.0.1**&emsp;<sub><sup>2025-06-24 ([f39b1ea...fda3ad1](https://github.com/stenciljs/jest-stencil-runner/compare/f39b1ea...fda3ad1?diff=split))</sup></sub>

### Added

- **Initial Release** - Complete Jest testing framework for Stencil components
- Core testing infrastructure with Jest v30+ compatibility
- Stencil integration using Stencil's own testing platform and DOM mocking
- Full TypeScript support with proper type definitions
- Custom Jest matchers for enhanced component testing:
  - **HTML Matchers**: `toEqualHtml()`, `toEqualLightHtml()` for DOM comparison
  - **Text Matchers**: `toEqualText()` for text content validation
  - **Attribute Matchers**: `toHaveAttribute()`, `toEqualAttribute()` for attribute testing
  - **Class Matchers**: `toHaveClass()`, `toHaveClasses()` for CSS class validation
  - **Event Matchers**: `toHaveReceivedEvent()`, `toHaveReceivedEventDetail()` for event testing
- Component testing utilities with `newSpecPage()` function
- Shadow DOM testing and snapshotting support
- Comprehensive example project with multiple test component types:
  - Form input components with validation testing
  - Interactive button components with event handling
  - Status card components with conditional rendering
  - Utility function testing examples
- Jest preset configuration for easy project setup
- TypeScript preprocessor for seamless TS/TSX file handling
- Build system with tsdown for efficient bundling
- Extensive documentation and usage examples
- CI/CD pipeline with automated testing and publishing
- Workspace configuration with pnpm for monorepo support

### Technical Details

- Built on Jest v30+ with modern testing practices
- Leverages Stencil's testing platform for authentic component behavior
- Supports both HTML string templates and JSX templates for test setup
- Includes proper module exports for different use cases (preset, preprocessor, setup)
- Comprehensive test coverage for all matcher functions
- Example project demonstrates real-world testing scenarios

### Development Infrastructure

- ESLint configuration with TypeScript support
- Prettier code formatting with Ionic configuration
- Automated dependency management and security updates
- GitHub Actions CI/CD pipeline for testing and releases
- Comprehensive test suite covering all functionality
- Development tooling for watch mode and incremental builds

<br>
