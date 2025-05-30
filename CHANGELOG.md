# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2023-10-25
- Implemented fade in/out animations for modal open/close using CSS transitions in ModalManager.
- Modified close button handling in EventManager to call ModalManager.closeModal(), ensuring the fade-out animation is triggered.
- Added support for customizable fade duration via the new data attribute `data-fade-duration` in LightboxConfig, DEFAULT_CONFIG, and ConfigManager.
- Updated thumbnail processing to reflect the new structure: removed the wrapper div and renamed the attribute from `data-full-src` to `data-full-img-src` (backward compatible).
- Reverted thumbnail cloning logic in ModalManager to correctly use slice(0, -1), excluding only the modal template thumbnail while copying all main thumbnails.

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