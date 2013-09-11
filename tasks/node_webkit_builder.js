/*
 * grunt-node-webkit-builder
 * https://github.com/mllrsohn/grunt-node-webkit-builder
 *
 * Copyright (c) 2013 Steffen Müller
 * Copyright (c) 2013 Jens Alexander Ewald
 * Licensed under the MIT license.
 */

var Q = require('q'),
  path = require('path'),
  fs = require('fs'),
  path = require('path'),
  plist = require('plist'),
  async = require('async');

var defaults = {
  src: "./app/**/*",
  options: {
    version: '0.7.1',
    build_dir: false, // Path where
    force_download: false,
    win: false,
    mac: true,
    linux32: false,
    linux64: false,
    download_url: 'https://s3.amazonaws.com/node-webkit/',
    timestamped_builds: false,
    keep_nw: true
  }
};

module.exports = function(grunt) {

  // ***************************************************************************
  // Verifying/merging required configurations

  var config = grunt.config.get(); // get the global config

  if(!config.hasOwnProperty('nodewebkit')) {
    console.log("nodewebkit config not found! using defaults");
    grunt.config('nodewebkit',defaults);
    // re-fetch the config
    config = grunt.config.get();
  }

  // // Strip out any globbing from src path
  var src = grunt.config('nodewebkit.src').replace(/\*.*$/,''),
      appPkg = grunt.file.readJSON(path.resolve(src,'package.json'));

  if (undefined === config.nodewebkit.options.app) {
    config.nodewebkit.options.app = {};
  }

  var nodewebkit_cfg = grunt.util._.merge(config.nodewebkit.options.app,appPkg);
  grunt.config('nodewebkit.options.app',nodewebkit_cfg);

  // ***************************************************************************
  // Merge build options from package.json, if loaded in grunt
  // if(config.hasOwnProperty('pkg')){
  //   grunt.config(
  //     'nodewebkit.options.app',
  //     grunt.util._.extend(grunt.config('nodewebkit.options.app'),grunt.config('pkg'))
  //   );
  // }

  // ***************************************************************************
  // assert we have everything we need:
  grunt.config.requires("nodewebkit");
  grunt.config.requires("nodewebkit.src");
  grunt.config.requires("nodewebkit.options");
  grunt.config.requires("nodewebkit.options.app.name");
  grunt.config.requires("nodewebkit.options.app.version");

  // console.log(grunt.config.get());
  // console.log(grunt.config('nodewebkit'));

  // ***************************************************************************
  // Configure the task:
  grunt.registerMultiTask(
    'nodewebkit',
    'Packaging the current app as a node-webkit application',
    function() {

    var compress = require('./lib/compress')(grunt),
        download = require('./lib/download')(grunt);


    var appName = grunt.config('nodewebkit.options.app.name');

    var self = this,
      done = this.async(), // This is async so make sure we initalize done
      package_path = false,
      downloadDone = [],
      webkitFiles = [{
        'url': "v%VERSION%/node-webkit-v%VERSION%-win-ia32.zip",
        'type': 'win',
        'files': ['ffmpegsumo.dll', 'icudt.dll', 'libEGL.dll', 'libGLESv2.dll', 'nw.exe', 'nw.pak'],
        'nwpath': 'nw.exe',
        'app': appName+'.exe',
        'exclude': ['nwsnapshot.exe']
      }, {
        'url': "v%VERSION%/node-webkit-v%VERSION%-osx-ia32.zip",
        'type': 'mac',
        'files': ['node-webkit.app'],
        'nwpath': appName+'.app/Contents/Resources',
        'app': 'app.nw', // We have to keep the name as "app.nw" on OS X!
        'exclude': ['nwsnapshot']
      }, {
        'url': "v%VERSION%/node-webkit-v%VERSION%-linux-ia32.tar.gz",
        'type': 'linux32',
        'files': ['nw', 'nw.pak', 'libffmpegsumo.so'],
        'nwpath': 'nw',
        'app': appName,
        'exclude': ['nwsnapshot']
      }, {
        'url': "v%VERSION%/node-webkit-v%VERSION%-linux-x64.tar.gz",
        'type': 'linux64',
        'files': ['nw', 'nw.pak', 'libffmpegsumo.so'],
        'nwpath': 'nw',
        'app': appName,
        'exclude': ['nwsnapshot']
      }],
      options = this.options(defaults.options);

    // Check the target plattforms
    if (!grunt.util._.any(grunt.util._.pick(options,"win","mac","linux32","linux64")))
    {
      grunt.log.warn("No platforms to build!");
      return done();
    }

    var release_path = path.resolve(
        options.build_dir
      , 'releases'
      , appName + ' - ' + options.app.version + (
        options.timestamped_builds
                  ?  ' - ' + Math.round(Date.now() / 1000).toString()
                  : ''
        )
    );

    var releaseFile = path.resolve(
        release_path
      , appName+'.nw'
    );

    // Make the release_path itself
    grunt.file.mkdir(release_path);

    // Compress the project into the release path
    downloadDone.push(compress.generateZip(this.files, releaseFile));

    // Download and unzip / untar the needed files
    webkitFiles.forEach(function(plattform) {
      if (options[plattform.type]) {
        plattform.url = options.download_url + plattform.url.split('%VERSION%').join(options.version);
        plattform.dest = path.resolve(
            options.build_dir
          , 'cache'
          , plattform.type
          , options.version
        );

        // If force is true we delete the path
        if (grunt.file.isDir(plattform.dest) && options.force_download) {
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
      var zipFile = releaseFile,
        generateDone = [];

      plattforms.forEach(function(plattform) {
        var releaseDone = [],
          releaseFolder, releasePathApp;

        if (!plattform) {
          return false;
        }

        // Set the release folder
        releaseFolder  = path.resolve(
          release_path, plattform.type, (plattform.type !== 'mac' ? appName : '')
        );
        releasePathApp = path.resolve(
          releaseFolder,
          (plattform.type === 'mac' ? plattform.nwpath : ''),
          plattform.app
        );

        // If plattform is mac, we just copy node-webkit.app
        // Otherwise we copy everything that is on the plattform.files array
        grunt.file.recurse(plattform.dest, function(abspath, rootdir, subdir, filename) {
          if (plattform.exclude.indexOf(filename)>=0) {
            return;
          }
          if (plattform.type === 'mac') {
            if(filename !== plattform.filename) {
              // Name the .app bundle on OS X correctly
              subdir = (subdir ? subdir.replace(/^node-webkit/,appName) : subdir);
              subdir = (subdir ? subdir : '');
              var stats = fs.lstatSync(abspath);
              var target_filename = path.join(releaseFolder, subdir, filename);
              grunt.file.copy(abspath, target_filename);

              if (target_filename.match(appName+'.app/Contents/Info.plist$')) {
                // Handle the INfo.plist file
                var info = plist.parseFileSync(target_filename);

                info.CFBundleDisplayName = appName;
                info.CFBundleName = appName;

                info.CFBundleDocumentTypes = []; // zero out any document binding
                info.UTExportedTypeDeclarations = [];

                info.CFBundleVersion = grunt.config('nodewebkit.options.app.version'); // TODO: if git, get commit hash!
                info.CFBundleShortVersionString = 'Version ' + grunt.config('nodewebkit.options.app.version');

                if(grunt.config('nodewebkit.options.app.copyright')) {
                  info.NSHumanReadableCopyright = grunt.config('nodewebkit.options.app.copyright');
                }

                grunt.file.write(
                  target_filename,
                  plist.build(info)
                );

                // Copy the Credits.html
                var credits = path.resolve(grunt.config('nodewebkit.src').replace(/\*.*/,''),'Credits.html');
                if (grunt.file.exists(credits)){
                  grunt.file.copy(credits, path.resolve(path.dirname(target_filename),'Resources','Credits.html'));
                }
              }

              fs.chmodSync(target_filename, stats.mode);
              // TODO: edit the plist file according to config
            }
          } else if (plattform.files.indexOf(filename) >= 0) {
            // Omit the nw executable on other platforms
            if(filename !== 'nw.exe' && filename !== 'nw') {
              grunt.file.copy(abspath, path.join(releaseFolder, filename));
            }
          }
        });

        // Let's create the release
        generateDone.push(
          compress.generateRelease(
            releasePathApp,
            zipFile,
            plattform.type,
            (plattform.type !== 'mac' ? path.resolve(plattform.dest, plattform.nwpath) : null)
          )
        );
      });

      Q.all(generateDone).done(function(plattforms) {
        grunt.log.oklns('Created a new release with node-webkit ('+options.version+') for '+plattforms.join(', '));
        grunt.log.ok('@ ' + release_path);
        done();
      });

    });
  });
};