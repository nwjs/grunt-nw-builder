'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
    nwjs: {
		options: {
			buildDir: './dist', // Where the build version of my NW.js app is saved
			platforms: ['win32', 'win64', 'linux32', 'linux64'],
			flavor: 'normal'
		},
		src: [  // Your NW.js app
			'../rotateur/css/*',
			'../rotateur/js/*',
			'../rotateur/icons/*',
			'../rotateur/fonts/*',
			'../rotateur/node_modules/**/*',
			'../rotateur/index.html',
			'../rotateur/package.json'
		]
    },
  });
  
  grunt.loadNpmTasks('grunt-nw-builder');
  grunt.registerTask('default', ['nwjs']);
};