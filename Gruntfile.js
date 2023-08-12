module.exports = function (grunt) {
  grunt.initConfig({
    nwjs: {
      options: {
        mode: "run",
        version: "0.78.1",
        flavour: "normal",
        srcDir: "fixture/app",
        glob: false,
      },
      src: ["fixture/app/**/*"],
    },
  });

  grunt.loadTasks("tasks");
  grunt.registerTask("run", ["nwjs"]);
};
