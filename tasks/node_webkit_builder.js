/*
 * grunt-node-webkit-builder
 * https://github.com/mllrsohn/grunt-node-webkit-builder
 *
 * Copyright (c) 2013 Steffen Müller
 * Licensed under the MIT license.
 */

var Q = require('q'),
  path = require('path'),
  fs = require('fs'),
  path = require('path'),
  async = require('async');


module.exports = function(grunt) {

  grunt.registerMultiTask('nodewebkit', 'Your task description goes here.', function() {
    var compress = require('./lib/compress')(grunt),
      download = require('./lib/download')(grunt);

    var self = this,
      done = this.async(), // This is async so make sure we initalize done
      package_path = false,
      downloadDone = [],
      options = this.options({
        version: '0.7.1',
        webkit_src: false, // Path where
        force: false,
        win: false,
        mac: true,
        linux32: false,
        linux64: false,
        download_url: 'https://s3.amazonaws.com/node-webkit/',
        appName: 'app',
        appVersion: Math.round(Date.now() / 1000).toString()
      }),
      webkitFiles = [{
        'url': "v%VERSION%/node-webkit-v%VERSION%-win-ia32.zip",
        'type': 'win',
        'files': ['ffmpegsumo.dll', 'icudt.dll', 'libEGL.dll', 'libGLESv2.dll', 'nw.exe', 'nw.pak'],
        'nwpath': 'nw.exe',
        'app': options.appName + '.exe'
      }, {
        'url': "v%VERSION%/node-webkit-v%VERSION%-osx-ia32.zip",
        'type': 'mac',
        'files': ['node-webkit.app'],
        'nwpath': 'node-webkit.app/Contents/Resources',
        'app': options.appName + '.nw'
      }, {
        'url': "v%VERSION%/node-webkit-v%VERSION%-linux-ia32.tar.gz",
        'type': 'linux32',
        'files': ['nw', 'nw.pak', 'libffmpegsumo.so'],
        'nwpath': 'nw',
        'app': options.appName
      }, {
        'url': "v%VERSION%/node-webkit-v%VERSION%-linux-x64.tar.gz",
        'type': 'linux64',
        'files': ['nw', 'nw.pak', 'libffmpegsumo.so'],
        'nwpath': 'nw',
        'app': options.appName
      }];

    var release_path = path.resolve(options.webkit_src, options.version, 'releases', options.appVersion);
    grunt.file.mkdir(release_path);

    // Compress the project into the release path
    downloadDone.push(compress.generateZip(this.files, path.resolve(release_path, options.appName + '.nw')));

    // Download and unzip / untar the needed files
    webkitFiles.forEach(function(plattform) {
      if (options[plattform.type]) {
        plattform.url = options.download_url + plattform.url.split('%VERSION%').join(options.version);
        plattform.dest = path.resolve(options.webkit_src, options.version, 'src', plattform.type);

        // If force is true we delete the path
        if (grunt.file.isDir(plattform.dest) && options.force) {
          grunt.file.delete(plattform.dest, {
            force: true
          });
        }

        // Download files
        downloadDone.push(download.downloadAndUnpack(plattform));
      }
    });

    // Download and zip creation done, let copy
    // the files and stream the zip into the files/folders
    Q.all(downloadDone).done(function(plattforms) {
      var zipFile = path.resolve(release_path, options.appName + '.nw'),
        generateDone = [];

      plattforms.forEach(function(plattform) {
        var releaseDone = [],
          releaseFolder, releasePathApp;

        if (!plattform) {
          return false;
        }

        // Set the release folder
        releaseFolder = path.resolve(release_path, plattform.type);
        releasePathApp = path.resolve(release_path, plattform.type, (plattform.type === 'mac' ? plattform.nwpath : ''), plattform.app);

        // If plattform is mac, we just copy node-webkit.app
        // Otherwise we copy everything that is on the plattform.files array
        grunt.file.recurse(plattform.dest, function(abspath, rootdir, subdir, filename) {
          if (plattform.type === 'mac') {
            if(filename !== plattform.filename) {
              var stats = fs.lstatSync(abspath);
              subdir = (subdir ? subdir : '');
              grunt.file.copy(abspath, path.join(releaseFolder, subdir, filename));
              fs.chmodSync(path.join(releaseFolder, subdir, filename), stats.mode);
            }
          } else if (plattform.files.indexOf(filename) >= 0) {
            grunt.file.copy(abspath, path.join(releaseFolder, filename));
          }
        });

        // Let's create the release
        generateDone.push(compress.generateRelease(releasePathApp, zipFile, plattform.type, (plattform.type !== 'mac' ? path.resolve(plattform.dest, plattform.nwpath) : null)));
      });

      Q.all(generateDone).done(function(plattforms) {
        grunt.log.oklns('Created a new release with node-webkit ('+options.version+') for '+plattforms.join(', '));
        grunt.log.ok('@ ' + release_path);
        done();
      });

    });
  });
};