module.exports = function (grunt) {
  grunt.initConfig({
    nwjs: {
      get: {
        options: {
          mode: "get",
          version: "0.85.0",
          flavor: "sdk"
        },
        src: "test/app",
      }
    },
  });

  grunt.loadTasks("tasks");
  grunt.registerTask("get", ["nwjs"]);
};
