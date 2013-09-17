var plist = require('plist');

module.exports = function(grunt) {
    exports.generatePlist = function(target_filename, appOptions) {

        // Handle the INfo.plist file
        var info = plist.parseFileSync(target_filename);

        info.CFBundleDisplayName = appOptions.name;
        info.CFBundleName = appOptions.name;

        info.CFBundleDocumentTypes = []; // zero out any document binding
        info.UTExportedTypeDeclarations = [];

        info.CFBundleVersion = appOptions.version; // TODO: if git, get commit hash!
        info.CFBundleShortVersionString = 'Version ' + appOptions.version;

        if(appOptions.copyright) {
          info.NSHumanReadableCopyright = appOptions.copyright;
        }

        grunt.file.write(
          target_filename,
          plist.build(info)
        );
    };

    return exports;
};
