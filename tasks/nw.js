module.exports = function (grunt) {
  grunt.registerMultiTask(
    "nwjs",
    "Package Node.js app as NW.js app",
    async function () {
      const done = this.async();
      const options = this.options();
      // Set options.srcDir via the Grunt task's src option:
      options.srcDir = this.data.src;

      let nwbuild = undefined;

      try {
        nwbuild = await import("nw-builder");
        nwbuild = nwbuild.default;
      } catch (e) {
        console.log(e);
      }

      await nwbuild(options);
      await done();
    },
  );
};
