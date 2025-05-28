# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-05-28

### Added
- Initial release of @pxm/elements package
- Phone input component with the following features:
  - International phone number formatting
  - Country selection
  - Validation
  - Accessible design
  - Customizable styling
  - Hidden input for full phone number with country code
- Configuration options for phone input:
  - `data-initial-country`: Set initial country (default: "ae")
  - `data-separate-dial-code`: Show dial code separately
  - `data-format-on-display`: Format number while typing
- Support for individual component installation
- TypeScript definitions
- Source maps for debugging
- GitHub Actions workflow for automatic npm publishing 