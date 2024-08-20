# Changelog

## [4.9.0](https://github.com/nwjs/grunt-nw-builder/compare/v4.8.1...v4.9.0) (2024-08-20)


### Features

* **deps:** bump nw-builder from 4.8.1 to 4.9.0 in the npm group ([#221](https://github.com/nwjs/grunt-nw-builder/issues/221)) ([43d3b2a](https://github.com/nwjs/grunt-nw-builder/commit/43d3b2ade1329ecdf73405476e5c14cf930a4fcb))


### Chores

* **deps:** bump axios from 1.7.3 to 1.7.4 in the npm_and_yarn group ([#219](https://github.com/nwjs/grunt-nw-builder/issues/219)) ([4bb8de6](https://github.com/nwjs/grunt-nw-builder/commit/4bb8de605da78e05190685a8baf065997a687894))

## [4.8.1](https://github.com/nwjs/grunt-nw-builder/compare/v4.8.0...v4.8.1) (2024-08-14)


### Bug Fixes

* **deps:** upgrade nw-builder to v4.8.1 ([754a2e9](https://github.com/nwjs/grunt-nw-builder/commit/754a2e9e8adb00ab85c704fa613cc2e860ca0045))
* **docs:** correct typo ([27d4eb0](https://github.com/nwjs/grunt-nw-builder/commit/27d4eb081fb4001a93793a2381102b7e188b2d9f))

## [4.8.0](https://github.com/nwjs/grunt-nw-builder/compare/v4.7.8...v4.8.0) (2024-07-27)


### Features

* **deps:** upgrade nw-builder to v4.8.0 ([5055d49](https://github.com/nwjs/grunt-nw-builder/commit/5055d492dd465dea8715fc11655212dc59239f55))


### Bug Fixes

* correct version in release please manifest ([0aa05e8](https://github.com/nwjs/grunt-nw-builder/commit/0aa05e84d726a6b4b1f0f4a195212a00dcc0f9dc))
* **git:** resolve conflicts ([dabe54f](https://github.com/nwjs/grunt-nw-builder/commit/dabe54fb259ddb1993c675a110374fa640ff2672))


### Chores

* bump actions/setup-node from 4.0.2 to 4.0.3 in /.github/workflows in the gha group ([#215](https://github.com/nwjs/grunt-nw-builder/issues/215)) ([43f6a97](https://github.com/nwjs/grunt-nw-builder/commit/43f6a976ce3d62a25ed1bc0a03f427fff3d39b03))
* **deps:** bump selenium-webdriver from 4.22.0 to 4.23.0 in the npm group ([#216](https://github.com/nwjs/grunt-nw-builder/issues/216)) ([32eb170](https://github.com/nwjs/grunt-nw-builder/commit/32eb170eda20db5c97e795811faf197546aae566))
* **docs:** move changelog to root ([81c9397](https://github.com/nwjs/grunt-nw-builder/commit/81c9397b9c816095eba2769d03bd0cd8eb4e10f1))

## Changelog

- 2016-09-14 `flavor` option; you can now select any flavor of NW.js, not just `sdk`.
- 2016-08-28 bumping nw-builder dependency to 3.0.0.
- 2016-07-02 `2.0.3` Fix for zip option plus some small nw-builder fixes.
- 2016-07-02 `2.0.2` Updated Grunt peer dependency
- 2016-07-02 `2.0.1` Supporting newer NW.js versions, alpha/beta builds, plus some other small fixes.
- ...
- 2014-12-12 `1.0.0` 64-bit support, improved platform-overrides and no more EMFILE errors. Also, macPlist CFBundleIdentifier is generated from `package.json`.
- 2014-08-01 `0.3.0` macPlist option improvements (see [mllrsohn/nw-builder#96](https://github.com/mllrsohn/nw-builder/pull/96))
- 2014-08-01 `0.2.0` Moved logic into a separate [module](https://github.com/mllrsohn/nw-builder), config options will be backward compatible except `keep_nw` is no longer supported
- 2013-09-19 Removed config merging (but kept the lookup for version number and name), added keep_nw option, fixed various small bugs.
- 2013-09-09 fixed accidential deletion of nw.exe on windows builds, adding several improvements, opt in for timestamped builds, using version and name from package.json to name the build product and build dir, renamed download directory to `cache`, added merge from package.json options for nodewebkit (no need to add configuration to Gruntfile, but stays optional)
- 2013-08-20 fix for the unzip lib
- 2013-08-13 initial release
