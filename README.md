# grunt-nw-builder

[![npm](https://img.shields.io/npm/v/grunt-nw-builder/latest)](https://www.npmjs.com/package/grunt-nw-builder/v/latest)
[![Join the chat at https://gitter.im/nwjs/nw-builder](https://badges.gitter.im/repo.svg)](https://app.gitter.im/#/room/#nwjs_nw-builder:gitter.im)

## Installation

Install package via `npm`:

```javascript
npm install grunt-nw-builder
```

Refer to `nw-builder`'s [Installation Guide](https://nwutils.io/nw-builder/install.html) for more options.

## Usage

Instead of using `options.srcDir`, we will use `nwjs.src` to parse NW.js project files:

```patch
grunt.initConfig({
  nwjs: {
    options: {
        mode: "run",
-       srcDir: "fixture/app",
        version: "0.78.1",
        flavor: "normal",
        glob: false,
      },
+     src: "fixture/app",
  },
});
```

Refer to `nw-builder`'s [docs](https://nwutils.io/nw-builder/) to learn what options to input.
