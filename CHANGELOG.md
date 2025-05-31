# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.8] - 2024-03-26
- Added new pxm-tabs component with the following features:
  - Flexible trigger elements (buttons, links, or any element with data-tab)
  - Keyboard navigation (arrow keys, home, end)
  - ARIA attributes for accessibility
  - Initial tab selection via data-initial attribute
  - Smooth transitions between tabs
  - Focus management
  - TypeScript support
- Added new pxm-accordion component with the following features:
  - Smooth expand/collapse animations
  - Keyboard navigation (arrow keys, home, end, enter/space)
  - Full ARIA support for accessibility
  - Configurable icon rotation
  - Support for multiple open sections
  - Customizable animation duration
  - Focus management
  - TypeScript support
- Added new pxm-number-input component with the following features:
  - Increment/decrement controls (buttons or links)
  - Min/max value constraints
  - Custom step size
  - Automatic disabled states for controls
  - Flexible styling options
  - Built-in validation
  - Keyboard support
  - Accessible design

## [0.1.7] - 2023-10-25
- Added new pxm-video component with the following features:
  - Support for multiple video sources (YouTube, Vimeo, Mux, MP4)
  - Automatic thumbnail generation for all supported sources
  - Custom thumbnail support with data-thumbnail attribute
  - Responsive design with customizable dimensions
  - Accessible controls and ARIA labels
  - Configurable autoplay, muted state, and controls
- Implemented fade in/out animations for modal open/close using CSS transitions in ModalManager.
- Modified close button handling in EventManager to call ModalManager.closeModal(), ensuring the fade-out animation is triggered.
- Added support for customizable fade duration via the new data attribute `data-fade-duration` in LightboxConfig, DEFAULT_CONFIG, and ConfigManager.
- Updated thumbnail processing to reflect the new structure: removed the wrapper div and renamed the attribute from `data-full-src` to `data-full-img-src` (backward compatible).
- Reverted thumbnail cloning logic in ModalManager to correctly use slice(0, -1), excluding only the modal template thumbnail while copying all main thumbnails.
- Enhanced Lightbox functionality: The lightbox now supports video media items. ModalManager now displays and autoplays videos using the new pxm-video component.

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