module.exports = function(grunt) {

  grunt.initConfig({
    pkg: {name:"name override demo", version: '1.2.3'},
    nodewebkit: {
      options: {
        build_dir: './webkitbuilds', // Where the build version of my node-webkit app is saved
        credits: './public/credits.html',
        mac: true, // We want to build it for mac
        win: false, // We want to build it for win
        linux32: false, // We don't need linux32
        linux64: false, // We don't need linux64
      },
      src: './public/**/*' // Your node-wekit app
    },
  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.registerTask('default', ['nodewebkit']);

};
