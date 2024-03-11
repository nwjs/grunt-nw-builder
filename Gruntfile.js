module.exports = function (grunt) {
  grunt.initConfig({
    nwjs: {
      options: {
        mode: "get",
        version: "0.85.0",
        flavor: "sdk",
        glob: false,
      },
      src: "test/app",
    },
  });

  grunt.loadTasks("tasks");
  grunt.registerTask("get", ["nwjs"]);
};
