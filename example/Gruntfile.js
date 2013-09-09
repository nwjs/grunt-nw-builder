module.exports = function(grunt) {

  grunt.initConfig({
    nodewebkit: {
      options: {
        webkit_src: './webkitbuilds', // Where the build version of my node-webkit app is saved
        mac: true, // We want to build it for mac
        win: false, // We want to build it for win
        linux32: false, // We don't need linux32
        linux64: false, // We don't need linux64
        version: '0.7.1'
      },
      src: ['./public/**/*'] // Your node-wekit app
    },

  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.registerTask('default', ['nodewebkit']);

};
