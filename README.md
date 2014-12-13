# grunt-node-webkit-builder [![NPM version][npm-image]][npm-url] [![Dependency Status][depstat-image]][depstat-url]

[![NPM](https://nodei.co/npm/grunt-node-webkit-builder.png?downloads=true)](https://nodei.co/npm/grunt-node-webkit-builder/)

> Let's you build your [node-webkit](http://github.com/rogerwang/node-webkit) apps for osx, win, and linux with grunt. It will download the prebuilt binaries for a specify version, unpacks it, creates a release folder, create the app.nw file for a specified directory and copys the app.nw file where it belongs.

*Issues with the output should be reported on the node-webkit-builder [issue tracker](https://github.com/mllrsohn/node-webkit-builder/issues). [![Build Status][travis-image]][travis-url]* 

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-node-webkit-builder --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-node-webkit-builder');
```

## The "nodewebkit" task  


### Usage Examples

```js
grunt.initConfig({
  nodewebkit: {
    options: {
        platforms: ['win','osx'],
        buildDir: './webkitbuilds', // Where the build version of my node-webkit app is saved
    },
    src: ['./example/public/**/*'] // Your node-webkit app
  },
})
```


### Options

Exactly the same as [node-webkit-builder](https://github.com/mllrsohn/node-webkit-builder). You have the advantage to configure the files via Grunt.

## Manifest Options

### platformOverrides

Just like [node-webkit-builder](https://github.com/mllrsohn/node-webkit-builder#manifest-options) you can specify platform-specific manifest values.

```json
{
    "name": "nw-demo",
    "version": "0.1.0",
    "main": "index.html",
    "window": {
        "frame": false,
        "toolbar": false
    },
    "platformOverrides": {
        "win": {
            "window": {
                "frame": true
            }
        }
    }

```

For more information see node-webkit-builder's [Manifest Options](https://github.com/mllrsohn/node-webkit-builder#manifest-options). 

## Troubleshooting

### OSX ulimit

Darwin (OS X kernel) has a low limit for file descriptors (256 per process) by default, so you might get an `EMFILE` error or an error mentioning "too many open files" if youtry to open more file descriptors than this.

To get around it, run `ulimit -n 1024` (or add it to your `~/.bash_profile`). For more information, see [henvic/osx-ulimit](https://github.com/henvic/osx-ulimit).


## Release History
- 2014-12-12    `1.0.0` 64-bit support, improved platform-overrides and no more EMFILE errors. Also, macPlist CFBundleIdentifier is generated from `package.json`.
- 2014-08-01    `0.3.0` macPlist option improvements (see [mllrsohn/node-webkit-builder#96](https://github.com/mllrsohn/node-webkit-builder/pull/96))
- 2014-08-01    `0.2.0` Moved logic into a separate [module](https://github.com/mllrsohn/node-webkit-builder), config options will be backward compatible except `keep_nw` is no longer supported
- 2013-09-19    Removed config merging (but kept the lookup for version number and name), added keep_nw option, fixed various small bugs.
- 2013-09-09    fixed accidential deletion of nw.exe on windows builds, adding several improvements, opt in for timestamped builds, using version and name from package.json to name the build product and build dir, renamed download directory to `cache`, added merge from package.json options for nodewebkit (no need to add configuration to Gruntfile, but stays optional)
- 2013-08-20    fix for the unzip lib
- 2013-08-13    initial release

[npm-url]: https://npmjs.org/package/grunt-node-webkit-builder
[npm-image]: http://img.shields.io/npm/v/grunt-node-webkit-builder.svg?style=flat

[travis-url]: http://travis-ci.org/mllrsohn/node-webkit-builder
[travis-image]: http://img.shields.io/travis/mllrsohn/node-webkit-builder/master.svg?style=flat

[depstat-url]: https://david-dm.org/mllrsohn/grunt-node-webkit-builder
[depstat-image]: https://david-dm.org/mllrsohn/grunt-node-webkit-builder.svg?style=flat
