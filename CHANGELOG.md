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
