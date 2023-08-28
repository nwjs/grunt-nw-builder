module.exports = function (grunt) {
  grunt.initConfig({
    nwjs: {
      options: {
        mode: "get",
        version: "0.79.1",
        flavor: "sdk",
        glob: false,
      },
      src: "test/app",
    },
  });

  grunt.loadTasks("tasks");
  grunt.registerTask("run", ["nwjs"]);
};
