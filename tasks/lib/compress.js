'use strict';

var fs = require('fs'),
    Q = require('q'),
    path = require('path'),
    archiver = require('archiver'),
    Readable = require('lazystream').Readable;

// Download and unzip/untar the node wekit files from aws
// Mostly copied from grunt-contrib-compress
module.exports = function(grunt) {

    // Generate a Zip file from a directory and a destination path
    // and returns back a read stream
    exports.generateZip = function(files, dest) {
        var package_path = false,
            zipDone = Q.defer(),
            destFiles = [],
            archive = archiver('zip'),
            destStream = fs.createWriteStream(dest);

        // Getting the paths we need
        files.forEach(function(file) {
            var src = file.src.filter(function(f) {
                return grunt.file.isFile(f);
            });

            src.forEach(function(srcFile) {
                var internalFileName = path.normalize(exports.unixifyPath(srcFile));
                // We need to make sure that the package.json is in the root
                if (internalFileName.match('package.json') && !internalFileName.match('node_modules')) {
                    package_path = path.normalize(internalFileName.split('package.json')[0]);
                }
                destFiles.push(internalFileName);
            });
        });

        if(!package_path) {
            grunt.fail.warn('Could not find a package.json in your src folder');
        }

        // Resolve on close
        destStream.on('close', zipDone.resolve);

        // Report Error
        archive.on('error', function(err) {
          grunt.log.error(err);
          grunt.fail.warn('Archiving failed.');
        });

        // Pipe archive to the destStream
        archive.pipe(destStream);

        // Push the files into the zip stream
        destFiles.forEach(function(srcFile) {
            var internalFileName = srcFile.replace(package_path, '');
            var srcStream = new Readable(function() {
              return fs.createReadStream(srcFile);
            });
            archive.append(srcStream, { name: internalFileName }, function(err) {
              grunt.verbose.writeln('Archiving ' + srcFile + ' -> ' + '/' + internalFileName.cyan);
            });
        });

        archive.finalize();

        return zipDone.promise;
    };

    exports.cleanUpRelease = function(nwPath,plattform) {
        // remove the cached .nw archive
        // TODO: Make an option to keep the unpacked nw archive
        if(grunt.file.exists(nwPath))
          grunt.file.delete(nwPath);
    };

    exports.generateRelease = function(relaseFile, zipPath, type, nwpath) {
        var releaseDone = Q.defer(),
            ws = fs.createWriteStream(relaseFile),
            zipStream = fs.createReadStream(zipPath),
            nwpath_rs;

        ws.on('error', function(err) {
            grunt.fail.fatal(err);
        });

        ws.on('close', function() {
            exports.cleanUpRelease(zipPath,type);
            releaseDone.resolve(type);
        });

        if(type === 'mac') {
            // On osx just copy to the target location
            zipStream.pipe(ws);
        } else {
            // on windows and linux cat the node-webkit with the nw archive
            nwpath_rs = fs.createReadStream(nwpath);

            nwpath_rs.on('error', function(err) {
                grunt.fail.fatal(err);
            });

            nwpath_rs.on('end', function(){
                zipStream.pipe(ws);
            });

            nwpath_rs.pipe(ws, { end: false });
        }

        return releaseDone.promise;
    };


    exports.unixifyPath = function(filepath) {
        if (process.platform === 'win32') {
            return filepath.replace(/\\/g, '/');
        } else {
            return filepath;
        }
    };

    return exports;
};