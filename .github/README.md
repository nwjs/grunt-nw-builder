# grunt-nw-builder

[![npm](https://img.shields.io/npm/v/grunt-nw-builder.svg?style=flat)](https://www.npmjs.com/package/nw-builder)
[![cd](https://github.com/nwjs/grunt-nw-builder/actions/workflows/cd.yml/badge.svg)](https://github.com/nwjs/grunt-nw-builder/actions/workflows/cd.yml)
[![ci](https://github.com/nwjs/grunt-nw-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/nwjs/grunt-nw-builder/actions/workflows/ci.yml)
[![Join the chat at https://gitter.im/nwjs/nw-builder](https://badges.gitter.im/nwjs/grunt-nw-builder.svg)](https://gitter.im/nwjs/nw-builder)

## Installation

Using npm:
```javascript
npm install grunt-nw-builder
```

Using yarn:
```javascript
yarn add grunt-nw-builder
```

Using pnpm:
```javascript
pnpm add grunt-nw-builder
```

## Usage

```javascript
grunt.initConfig({
  nwjs: {
    options: {
        platforms: ['win','osx'],
        buildDir: './webkitbuilds', // Where the build version of my NW.js app is saved
    },
    src: ['./example/public/**/*'] // Your NW.js app
  },
})
```

## API Reference

> Stay up to date via the [Changelog](https://github.com/nwjs/grunt-nw-builder/blob/master/.github/CHANGELOG.md).

Refer to the [nw-builder API](https://github.com/nwutils/nw-builder/#api-reference).

## Contributing

- Whenever possible, open an issue before submitting a pull request.
- PRs should have short descriptive titles. For example:
    - fix(docs): fix typo in usage section
    - feat(example): add demo app
- Ideally, a PR should reference a related issue
- ~Ensure there are tests that cover your changes~

## License

MIT