var fs = require('fs'),
    Q = require('q'),
    tar = require('tar-fs'),
    zlib = require('zlib'),
    path = require('path'),
    request = require('request'),
    progress = require('request-progress'),
    ZIP = require('zip');

function ProgressIndicator(grunt) {
    this.grunt = grunt;
    this.entries = {};
}

ProgressIndicator.prototype.add = function(id) {
    this.entries[id] = {total: Infinity, downloaded: 0};
};

ProgressIndicator.prototype.progress = function(id, totalByte, downloadedByte) {
    var entry = this.entries[id];
    entry.total = totalByte;
    entry.downloaded = downloadedByte;
    this.writeProgress();
};

ProgressIndicator.prototype.writeProgress = function () {
    var total = 0;
    var downloaded = 0;
    var percent = 100;
    for (var id in this.entries) {
        if (this.entries.hasOwnProperty(id)) {
            total += this.entries[id].total
            downloaded += this.entries[id].downloaded
        }
    }
    if (total !== 0) {
        percent = Math.floor(100.0 * downloaded / total);
    }
    var bar = [];
    for (var i = 0; i < 100; i += 2) {
        bar.push((i < percent) ? '#' : '-');
    }
    this.grunt.log.write('    ' + bar.join('') + ' ' + percent + '%\r');
};

// Download and unzip/untar the node wekit files from aws
module.exports = function(grunt) {
    exports.ProgressIndicator = ProgressIndicator;

    exports.downloadAndUnpack = function(plattform, indicator) {
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
/*
        // We should also check, if the zip archive already exists
        exists = grunt.file.exists(path.resolve(plattform.dest, plattform.filename));

        var extractDone;
        if(exists) {
          // TODO: Refactor the extract method!
          var removeFromPath = false, ext = 'zip';
          if(ext === 'zip') {
              removeFromPath = (plattform.type === 'win' ? plattform.filename.replace('.zip', '') : false);
              extractDone = exports.unzipFile(path.resolve(plattform.dest, plattform.filename), plattform.dest, removeFromPath);
          } else {
              extractDone = exports.untarFile(path.resolve(plattform.dest, plattform.filename), plattform.dest);
          }
          downloadAndUnpackDone.resolve(plattform);
          return downloadAndUnpackDone.promise;
        }

*/
        // Files do not exists, so we download them
        var downloadDone = exports.download(plattform.url, plattform.dest, indicator);
        downloadDone.done(function(data) {
            var extractDone, removeFromPath = false;
            // @TODO: We are using the very slow zip module because it
            // was very easy to patch in the unzip module to support
            // file permission for mac

            if(data.ext === 'zip') {
                removeFromPath = (plattform.type === 'win' ? plattform.filename.replace('.zip', '') : false);
                extractDone = exports.unzipFile(data.dest, plattform.dest, removeFromPath);
            } else {
                extractDone = exports.untarFile(data.dest, plattform.dest);
            }

            extractDone.done(downloadAndUnpackDone.resolve.bind(downloadAndUnpackDone, plattform));

        });

        return downloadAndUnpackDone.promise;
    };

    exports.download = function(url, dest, indicator) {
        var downloadDone = Q.defer(),
            extention = (url.split('.')).slice(-1)[0],
            downloadPath = path.resolve(dest, (url.split('/')).slice(-1)[0]),
            destStream = fs.createWriteStream(downloadPath),
            downloadRequest;

            if(process.env.http_proxy){
                downloadRequest = progress(request({url: url, proxy: process.env.http_proxy}));
            }else{
                downloadRequest = progress(request(url));
            }
        grunt.log.writeln('Downloading: ' + url);
        indicator.add(url);

        destStream.on('close', function() {
            downloadDone.resolve({dest: downloadPath, ext: extention});
        });

        destStream.on('error', function(error) {
            grunt.log.error(error);
            grunt.fail.warn('Download write failed.');
        });

        downloadRequest.on('error', function(error) {
            grunt.log.error(error);
            grunt.fail.warn('There was an error while downloading.');
        });

        downloadRequest.on('progress', function(state) {
            indicator.progress(url, state.total, state.received);
        });

        downloadRequest.pipe(destStream);

        return downloadDone.promise;
    };

    exports.unzipFile = function(file, dest, removeFromPath) {
        var _zipReader = ZIP.Reader(fs.readFileSync(file)),
            unzipDone = Q.defer();

        grunt.log.writeln('Unzipping: ' + file);

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

    exports.untarFile = function(file, dest) {
        var untarDone = Q.defer();

        fs.createReadStream(file)
            .pipe(zlib.createGunzip())
            .pipe(tar.extract(dest))
            .on('finish', function() {
                var basename = path.basename(file, '.tar.gz');
                fs.readdir(path.join(dest, basename), function (err, files) {
                    for (var i = 0; i < files.length; i++) {
                        fs.renameSync(path.join(dest, basename, files[i]), path.join(dest, files[i]));
                    }
                    fs.rmdirSync(path.join(dest, basename));
                    untarDone.resolve();
                });
            })
            .on('error', function(error) {
                grunt.log.error('There was an error untaring the file', error);
            });

        return untarDone.promise;
    };

    return exports;
};
