# Migration
All notable changes that affect the backwards compatability of this project will be documented in this file.

## 2.9.2 - 2014-12-14
### Changed
- jPlayer Repository Refactor: The skins source files are now in `src/skin` and the build skins files in the 'dist/skin' folder.
- jPlayer Repository Refactor: All the circle player specific files are now in the `lib/circle-player` folder.
- jPlayer Repository Refactor: Changed the html `examples` file extentions from `htm` to `html` for @Laurian.


## 2.8.2 - 2014-11-19

The author appologises for breaking the [Semantic Versioning](http://semver.org/) rules again in this update.

### Added
- Package Fix: The un-minified source is now also added to the `dist` folder.

### Changed
- Package Fix: Renamed the built folder to `dist`, which is more appropriate than the previous naming of `js`.
- Default Options: The default key bindings have been changed to:
	- **p** play/pause toggle
	- **f** full/restore screen toggle
	- **m** mute/unmute toggle
	- **,** decrease volume
	- **.** increase volume
	- **[** previous item (playlist)
	- **]** next item (playlist)

### Removed
- Package Fix: The old `js` build folder.


## 2.8.0 - 2014-11-11

The author appologises for breaking the [Semantic Versioning](http://semver.org/) rules and only raising the `MINOR` version, instead of correctly increamenting the `MAJOR` version.

### Added
- jPlayer Repository Refactor: Added all download content to the repository and added a grunt build system. The example demos work within the repository, and use the built (minified) jPlayer files.

## Changed
- Refactor: Renamed the SWF file from `Jplayer.swf` to `jquery.jplayer.swf`
- Refactor: The Flash `jquery.jplayer.swf` file is now compiled using the Flex compiler in the `grunt-mxmlc` node.js module.
- Skins: The skins are now designed for ARIA. Please use the options `{useStateClassSkin: true, autoBlur: false}`

## Removed
- Refactor: Refactored the Flash ActionScript, removing the `TraceOut` class from the `Jplayer.as` code and the `happyworm` package.


## 2.7.1 - 2014-09-19

This was the last version that used the old repository structure.