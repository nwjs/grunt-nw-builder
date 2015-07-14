module.exports = function(grunt) {

  grunt.initConfig({
    nwjs: {
      options: {
        version: '0.10.0',
        buildDir: './build', // Where the build version of my NW.js app is saved
        credits: './public/Credits.html',
        macIcns: './icon.icns', // Path to the Mac icon file
        platforms: ['osx', 'win'] // These are the platforms that we want to build
      },
      src: './public/**/*' // Your NW.js app
    },
  });

  grunt.loadNpmTasks('grunt-nw-builder');
  grunt.registerTask('default', ['nwjs']);

};
