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

`nwjs.src` is passed into `options.srcDir` internally. Hence you don't need to specify `nwjs.srcDir`.

When globbing is enabled:

```patch
grunt.initConfig({
  nwjs: {
    get: {
      options: {
        mode: "build",
-       srcDir: "./package.json ./app/**/*",
        version: "0.85.0",
      },
+     src: [ "./package.json", "./app/**/*" ],
    },
  },
});
```

When globbing is enabled:

```patch
grunt.initConfig({
  nwjs: {
    get: {
      options: {
        mode: "get",
-       srcDir: "./app",
        version: "0.85.0",
        glob: false,
      },
+     src: "./app",
    },
  },
});
```

Refer to `nw-builder`'s [docs](https://github.com/nwutils/nw-builder) to learn what options to input.
