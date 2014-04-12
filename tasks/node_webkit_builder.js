var NwBuilder = require('node-webkit-builder');
module.exports = function(grunt) {

  grunt.registerMultiTask('nodewebkit', 'Packaging the current app as a node-webkit application', function() {
      var done = this.async(),
          options = this.options();

          options.files = this.filesSrc;
          var nw = new NwBuilder(options);

          // Some Logging
          nw.on('log',function (log) {
             grunt.log.writeln(log);
          });

          nw.build(function(err) {
              if(err) {
                grunt.log.warn('There was an Error:', err);
              } else {
                grunt.log.ok('nodewebkit app created.');
              }
              done();
          });
  });

};