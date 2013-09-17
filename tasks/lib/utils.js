var plist = require('plist'),
    path = require('path');

module.exports = function(grunt) {
    exports.generatePlist = function(target_filename, options, appOptions) {

        // Handle the INfo.plist file
        var info = plist.parseFileSync(target_filename);

        info.CFBundleDisplayName = options.app_name;
        info.CFBundleName = options.app_name;

        info.CFBundleDocumentTypes = []; // zero out any document binding
        info.UTExportedTypeDeclarations = [];

        info.CFBundleVersion = options.app_version; // TODO: if git, get commit hash!
        info.CFBundleShortVersionString = 'Version ' + options.app_version;

        if(appOptions.copyright) {
          info.NSHumanReadableCopyright = appOptions.copyright;
        }

        grunt.file.write(target_filename, plist.build(info));
    };

    exports.getPackageInfo = function(files) {
        var jsonfile = null;
        grunt.verbose.writeln("Trying to get the app_name and/or app_version from your project's json file.");

        // Getting the paths we need
        files.forEach(function(file) {
            var src = file.src.filter(function(f) {
                return grunt.file.isFile(f);
            });

            src.forEach(function(srcFile) {
                var internalFileName = path.normalize(exports.unixifyPath(srcFile));
                if (internalFileName.match('package.json') && !internalFileName.match('node_modules')) {
                    jsonfile = internalFileName;
                }
            });
        });

        if(!jsonfile) {
            grunt.fail.warn('Could not find a package.json in your src folder');
        }

        // Read JSON File
        var appPkg = grunt.file.readJSON(jsonfile);
        if(!appPkg.name || !appPkg.version) {
            grunt.fail.warn("Please make sure that your project's package.json includes a version and a name value");
        }

        return appPkg;
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
