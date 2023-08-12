module.exports = function (grunt) {
  grunt.initConfig({
    nwjs: {
      options: {
        mode: "run",
        version: "0.78.1",
        flavour: "normal",
        srcDir: "app",
        glob: false,
      },
    },
  });

  grunt.loadNpmTasks("grunt-nw-builder");
  grunt.registerTask("run", ["nwjs"]);
};
