var fs = require('fs'),
    Q = require('q'),
    tar = require('tar'),
    zlib = require('zlib'),
    path = require('path'),
    request = require('request'),
    ZIP = require('zip'),
    progress = require('request-progress'),
    Readable = require('lazystream').Readable,
    Writable = require('lazystream').Writable;


// Download and unzip/untar the node wekit files from aws
module.exports = function(grunt) {

    exports.downloadAndUnpack = function(plattform) {
        var downloadAndUnpackDone = Q.defer(),
            exists = false;

        grunt.file.mkdir(plattform.dest);
        plattform.filename = ((plattform.url.split('/')).slice(-1)[0]);

        // We Check if the files exist
        plattform.files.every(function(file) {
          exists = grunt.file.exists(plattform.dest, file);
          return exists;
        });

        // If it exists, we resolve and return
        if(exists) {
          downloadAndUnpackDone.resolve(plattform);
          return downloadAndUnpackDone.promise;
        }

        // Files do not exists, so we download them
        var extention = (plattform.url.split('.')).slice(-1)[0],
            downloadPath = path.resolve(plattform.dest, (plattform.url.split('/')).slice(-1)[0]),
            destStream = fs.createWriteStream(downloadPath),
            downloadRequest = progress(request(plattform.url));


        // Make it nice and pretty
        downloadRequest.on('progress', downloadAndUnpackDone.notify).on('error', function(err) {
            grunt.log.error(err);
            grunt.fail.warn('There was an error while downloading.');
        });

        // Pipe or wait
        switch(extention) {
            case 'zip':
                destStream.on('en', function() {
                    var removeFromPath = (plattform.type === 'win' ? plattform.filename.replace('.zip', '') : false);
                    exports.unzipFile(downloadPath, plattform.dest, removeFromPath).then(function() {
                        downloadAndUnpackDone.resolve(plattform);
                    });
                });
            break;

            case 'gz':
                exports.untarFile(downloadRequest, plattform).then(function() {
                    downloadAndUnpackDone.resolve(plattform);
                });
            break;
        }

        // Save to Disk
        downloadRequest.pipe(destStream);

        return downloadAndUnpackDone.promise;

    };

    exports.unzipFile = function(file, dest, removeFromPath) {
        var _zipReader = ZIP.Reader(fs.readFileSync(file)),
            unzipDone = Q.defer();

        grunt.verbose.writeln('Unzipping: ' + file);

        _zipReader.forEach(function(entry) {
            var mode = entry.getMode(),
                fileName = path.resolve(dest, entry.getName());

            if(removeFromPath) {
                fileName = path.normalize(fileName.replace(removeFromPath, ''));
            }

            // Log unpacking
            grunt.verbose.writeln('Unpacking ' + entry.getName() + ' --> ' + fileName);

            if (entry.isDirectory()) {
                grunt.file.mkdir(fileName, function(err) {
                    if (mode) {
                        fs.chmodSync(fileName, mode);
                    }
                });
            } else {
                grunt.file.mkdir(path.dirname(fileName));
                fs.writeFileSync(fileName, entry.getData());
                if (mode) {
                    fs.chmodSync(fileName, mode);
                }
            }

        });

        // I know that this is blocking, the defered is just for consistency :)
        // And when node unzip supports permissions

        unzipDone.resolve();
        return unzipDone.promise;
    };

    exports.untarFile = function(inputstream, plattform) {
        var untarDone = Q.defer();

        inputstream.pipe(zlib.createGunzip())
            .pipe(tar.Extract({
                path: plattform.dest,
                strip: 1
            })).on('error', function(error) {
                grunt.log.error('There was an error untaring the file', error);
            }).on('end', function()  {
                untarDone.resolve(plattform);
            }).on("entry", function(entry) {
                var filename = entry.path.split('/').reverse()[0];
                grunt.verbose.writeln('Unpacking ' + filename + ' --> ' + path.resolve(plattform.dest, filename));
            });

        return untarDone.promise;
    };

    return exports;
};