# Change Log
All notable changes to this project will be documented in this file.

## 2.9.2 - 2014-12-14
### Added
- New Feature: Implemented Pull Request [Introduce sass skins](https://github.com/happyworm/jPlayer/pull/260) by [nervo](https://github.com/nervo).
- Bug Fix: Fixed [Example Demo-04 does not work](https://github.com/happyworm/jPlayer/issues/274).

### Changed
- jPlayer Repository Refactor: The skins source files are now in `src/skin` and the build skins files in the 'dist/skin' folder.
- jPlayer Repository Refactor: All the circle player specific files are now in the `lib/circle-player` folder.
- jPlayer Repository Refactor: Changed the html `examples` file extentions from `htm` to `html` for @Laurian.


## 2.9.1 - 2014-12-09
### Added
- Bug Fix: Fixed [Bug in IE8](https://github.com/happyworm/jPlayer/issues/269) reported by Denis.


## 2.9.0 - 2014-11-27
### Added
- New Feature: Merged Pull Request [Composer support](https://github.com/happyworm/jPlayer/pull/235) by [thormeier](https://github.com/thormeier).
- New Feature: Merged Pull Request [Add Aurora.js solution](https://github.com/happyworm/jPlayer/pull/246) by [Afterster](https://github.com/Afterster).


## 2.8.4 - 2014-11-24
### Added
- Bug fix: Merged Pull Request [Add support for native fullscreen api in Internet explorer](https://github.com/happyworm/jPlayer/pull/213) by [mattfawcett](https://github.com/mattfawcett).
- Bug fix: Merged Pull Request [Chrome on android mobile supports full screen](https://github.com/happyworm/jPlayer/pull/207) by [mattfawcett](https://github.com/mattfawcett).
- Bug fix: Merged Pull Request [Automatically destroy removed instances](https://github.com/happyworm/jPlayer/pull/150) by [sterlinghirsh](https://github.com/sterlinghirsh).


## 2.8.3 - 2014-11-20
### Added
- Bug fix: Merged Pull Request to [Return good ratio in Flash players when file loaded but no total length](https://github.com/happyworm/jPlayer/pull/185) by [Afterster](https://github.com/Afterster).
- Bug fix: Merged Pull Request to [fix for wrong mousemove event on Chrome browser](https://github.com/happyworm/jPlayer/pull/217) by [HobieCat](https://github.com/HobieCat).
- Bug fix: Merged Pull Request [Browser-compatibility fix for data URI scheme](https://github.com/happyworm/jPlayer/pull/239) by [smidgen](https://github.com/smidgen).


## 2.8.2 - 2014-11-19
### Added
- Package Fix: The un-minified source is now also added to the `dist` folder.
- New Feature: Merged Pull Request to add [commonJS support](https://github.com/happyworm/jPlayer/pull/257) by [nervo](https://github.com/nervo).
- Docs: Added CHANGELOG.md and gave details back to 2.7.1
- Docs: Added MIGRATION.md as placeholder for migration details.
- Bug Fix: Fixed Internet Explorer key bindings. Removed [`document.activeElement`](https://developer.mozilla.org/en-US/docs/Web/API/document.activeElement) useage from the key bindings code.
- New Feature: The key bindings option `key` value may now be a number for [`event.which`](http://api.jquery.com/event.which/) and a string for [`event.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent.key) comparison.
- Default Options: Added to the default key bindings:
	- **l** loop toggle
	- **s** shuffle toggle (playlist)

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


## 2.8.1 - 2014-11-13
### Added
- Skin Fix: Added the CSS3 rule to disable the default Firefox focus highlighting. Fixed both the Blue Monday and Pink Flag skins.
- Bug Fix: Fixed the media title being displayed in iOS Control Center when there is no GUI title element.


## 2.8.0 - 2014-11-11
### Added
- ARIA Feature: The `autoBlur` option will now either `blur()` or `focus()`. This helps maintain cross-browser behaviour when a user clicks on a GUI button.
- New Feature: Added the `noVolume` state class for when the volume controls are being hidden due to the `noVolume option`. This helps GUI design by enabling a CSS rule to hide the volume controls.
- jPlayer Repository Refactor: Added all download content to the repository and added a grunt build system. The example demos work within the repository, and use the built (minified) jPlayer files.

## Changed
- Refactor: Renamed the SWF file from `Jplayer.swf` to `jquery.jplayer.swf`
- Refactor: The Flash `jquery.jplayer.swf` file is now compiled using the Flex compiler in the `grunt-mxmlc` node.js module.
- Skins: The skins are now designed for ARIA. Please use the options `{useStateClassSkin: true, autoBlur: false}`

## Removed
- Refactor: Refactored the Flash ActionScript, removing the `TraceOut` class from the `Jplayer.as` code and the `happyworm` package.


## 2.7.1 - 2014-09-19
### Added
- Bug Fix: Fixed the legacy Android fix to work with latest Android. This moved the android fix code to the `loadeddata` event from the `progress` event.


## 2.7.0 - 2014-09-01
For older changes, view these [release notes](http://jplayer.org/latest/release-notes/).
