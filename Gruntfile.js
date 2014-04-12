/*
 * grunt-node-webkit-builder
 * https://github.com/steffen/grunt-node-webkit-builder
 *
 * Copyright (c) 2013 Steffen Müller
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nodewebkit: {
      options: {
        buildDir: './example/build',
        macCredits: './example/public/Credits.html',
        macIcns: './example/icon.icns'
      },
      src: './example/public/**/*'
    }
  });

  // Actually load this plugin's task(s)1
  grunt.loadTasks('tasks');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['nodewebkit']);

};