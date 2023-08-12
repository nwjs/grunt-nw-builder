/*
 * grunt-nw-builder
 * https://github.com/steffen/grunt-nw-builder
 *
 * Copyright (c) 2013 Steffen Müller
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    nwjs: {
      options: {},
    },
  });

  grunt.loadTasks("tasks");
  grunt.registerTask("default", ["nwjs"]);
};
