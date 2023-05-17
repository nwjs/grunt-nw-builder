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
    nwjs: {
      options: {
        srcDir: "./e2e/app",
        version: "latest",
        glob: false,
      },
    },
  });

  grunt.registerTask("default", "nwjs", async function () {
    const done = this.async();
    const options = this.options();

    let nwbuild = undefined;

    try {
      nwbuild = await import("nw-builder");
      nwbuild = nwbuild.default;
    } catch (e) {
      console.log(e);
    }

    await nwbuild(options);
    await done();
  });
};
