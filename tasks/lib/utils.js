var plist = require('plist');

module.exports = function(grunt) {
    exports.generatePlist = function(target_filename, appName) {

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
    };

    return exports;
};
