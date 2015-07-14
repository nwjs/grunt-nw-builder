var NwBuilder = require('nw-builder');

function toCamelcase(str) {
  return str.replace(/\_+([a-z])/g, function (x, chr) { return chr.toUpperCase(); });
}

function addPlatform(opts, p){
  var ps = opts['platforms'] = opts['platforms'] || [];
  if( ps.indexOf(p) === -1 ) ps.push(p);
}

module.exports = function(grunt) {

  grunt.registerMultiTask('nwjs', 'Packaging the current app as a node-webkit application', function() {
    var done = this.async(),
        options = this.options(),
        nwOptions = {};

    // Build out options for nw-builder
    Object.keys(options).forEach(function(opt) {

      // maintain backward compatibility by supporting old platform style
      switch(opt){
        case 'win':
        case 'win32':
        case 'win64':
        case 'osx':
        case 'osx32':
        case 'osx64':
        case 'linux':
        case 'linux32':
        case 'linux64':
          if(!!options[opt]) {
            addPlatform(nwOptions, opt);
          }
          break;

        case 'mac':
          if(!!options[opt]) {
            addPlatform(nwOptions, 'osx');
          }
          break;
        case 'mac32':
          if(!!options[opt]) {
            addPlatform(nwOptions, 'osx32');
          }
          break;
        case 'mac64':
          if(!!options[opt]) {
            addPlatform(nwOptions, 'osx64');
          }
          break;

        case 'timestamped_builds':
          nwOptions['buildType'] = 'timestamped';
          break;

        case 'credits':
        case 'zip':
          nwOptions[toCamelcase('mac_'+opt)] = options[opt];
          break;

        default:
          // convert all other keys to camelcase style required by nw-builder
          nwOptions[toCamelcase(opt)] = options[opt];
      }

    });
    nwOptions.files = this.filesSrc;
    
    // create and run nwbuilder
    var nw = new NwBuilder(nwOptions);

    nw.on('log',function (log) {
      grunt.log.writeln(log);
    });

    nw.build(function(err) {
      if(err) {
        grunt.fail.fatal(err);
      } else {
        grunt.log.ok('NW.js app created.');
      }
      done();
    });

  });

};