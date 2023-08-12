module.exports = async function (grunt) {
  grunt.registerMultiTask(
    "nwjs",
    "Package Node.js app as NW.js app",
    async function () {
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
    },
  );
};
