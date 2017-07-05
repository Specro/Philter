# Change Log
## [Unreleased]

## [1.4.1] - 2017-07-05
### Added
- Experimental anaglyph filter

### Fixed
- Custom filter directory not recognizing relative paths
- CLI nesting self closing tags when injecting SVG into HTML

## [1.4.0] - 2016-11-08
### Added
- Custom filters

### Fixed
- Color filter not merging with source graphic
- Uploading browser dist to npm

## [1.3.1] - 2016-10-26
### Added
- Error if first argument is not an array or a string
- Tests

### Changed
- Compressed SVG filters to one line

### Fixed
- Default SVG filter generating wrong CSS
- Empty SVG element returned if no SVG was generated
- CLI: Saving SVG when no SVG was generated

## [1.3.0] - 2016-10-25
### Added
- Node module
- CLI

### Removed
- jQuery version
- CSS class version

## [1.2.0] - 2016-03-03
### Added
- 6 new vintage SVG filters (vanilla JS version only)

### Changed
- Transition CSS rules are now applied only to Philter elements

### Fixed
- Inconsistent height on SVG filters
- CSS rules being applied to the first selector of the element and breaking on elements with same selectors
- SVG adding to body height
- Filter count increasing faster than data is being returned from the server causing wrong filter ids

## [1.1.2] - 2016-02-28
### Added
- Bower compatibility

## [1.1.1] - 2015-12-15
### Added
- Plugin version in vanilla JavaScript
- Option to remove 'philter' from data attributes to make markup shorter

### Fixed
- False element width or height being set on custom SVG filters

## [1.1.0] - 2015-11-07
### Changed
- Changed classes to data attributes to describe filters

### Removed
- Describing filters with classes The old version still can be found in dist directory
