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

    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js',
        'test/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Configuration to be run (and then tested).
    nodewebkit: {
      options: {
        build_dir: './example/build',
        credits: './example/public/Credits.html',
        force_download: false,
        mac: true,
        win: true,
        keep_nw: true,
        download_url: 'http://localhost:3333/',
      },
      src: './example/public/**/*'
    },

    simplemocha: {
        options: {
            reporter: 'spec',
            timeout: '5000'
        },
        full: { src: ['test/*.js'] },
        short: {
            options: {
                reporter: 'dot'
            },
            src: ['<%= simplemocha.full.src %>']
        }
    },
    watch: {
        files: ['test/*.js', 'tasks/**/*.js'],
        tasks: ['jshint', 'simplemocha:full']
    }

  });

  // Actually load this plugin's task(s)1

  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-release');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['jshint', 'simplemocha:full']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

  // By default, lint and run all tests.
  grunt.registerTask('dev', ['simplemocha:short', 'watch']);

};