module.exports = function (grunt) {
  grunt.registerMultiTask(
    "nwjs",
    "Package Node.js app as NW.js app",
    async function () {
      const done = this.async();
      const options = this.options();
      if (Array.isArray(this.data.src)) {
        /* If globbing is enabled, then src should be an array. */
        options.srcDir = this.data.src.join(" ");
      } else if (typeof this.data.src === "string") {
        /* If globbing is disabled, then src should be a string. */
        options.srcDir = this.data.src;
      } else {
        throw new Error("Expected src to be a string or an array of strings. Got " + typeof this.data.src + " instead.");
      }

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
