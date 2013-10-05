'use strict';

var grunt = require('grunt');
var path = require('path');
var util = require('../tasks/lib/utils')(grunt);


/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

function filesBySrc(files)
{
  var bySrc = {};
  files.forEach(function (f) { bySrc[f.src] = f.dest; });
  return bySrc;
}

exports.util = {
  getFileList: {
    setUp: function(callback) {
      this.isFile = grunt.file.isFile;
      grunt.file.isFile = function(f) { return !f.match(/missing$/); };
      this.normalize = path.normalize;
      path.normalize = function(f) { return f; };
      callback();
    },
    tearDown: function(callback) {
      grunt.file.isFile = this.isFile;
      path.normalize = this.normalize;
      callback();
    },
    original: function(test) {
      test.expect(3);
      var result = util.getFileList([{
        "src": [
          "dist/package.json",
          "dist/main from root.js",
          "dist/missing",
          "dist/img/logo from subdir.png",
          "dist/node_modules/some module/package.json",
          "other/not from dist.js"
        ],
        "dest": "src",
        "orig": {
          "src": [
            "dist/**/*",
            "other/**/*"
          ],
          "dest":"src"
        }
      }]);
      test.equal(result[0].length, 5);
      test.deepEqual(filesBySrc(result[0]), {
        "dist/package.json": "package.json",
        "dist/main from root.js": "main from root.js",
        "dist/img/logo from subdir.png": "img/logo from subdir.png",
        "dist/node_modules/some module/package.json": "node_modules/some module/package.json",
        "other/not from dist.js": "other/not from dist.js"
      });
      test.strictEqual(result[1], "dist/package.json");
      test.done();
    },
    gruntStandard: function(test) {
      test.expect(3);
      var distOrig = {
        "expand": true,
        "dot": true,
        "cwd": "dist",
        "src": [
          "**/*",
          "!node_modules/**/*"
        ]
      };
      var otherOrig = {
        "expand": true,
        "dot": true,
        "cwd": "other",
        "src": [
          "**/*"
        ]
      };
      var result = util.getFileList([
        {
          "dot": true,
          "src": ["dist/package.json"],
          "orig": distOrig,
          "dest": "package.json"
        },
        {
          "dot": true,
          "src": ["dist/main from root.js"],
          "orig": distOrig,
          "dest": "main from root.js"
        },
        {
          "dot": true,
          "src": ["dist/img/logo from subdir.png"],
          "orig": distOrig,
          "dest": "img/logo from subdir.png"
        },
        {
          "dot": true,
          "src": ["other/not from dist.js"],
          "orig": otherOrig,
          "dest": "not from dist.js"
        },
      ]);
      test.equal(result[0].length, 4);
      test.deepEqual(filesBySrc(result[0]), {
        "dist/package.json": "package.json",
        "dist/main from root.js": "main from root.js",
        "dist/img/logo from subdir.png": "img/logo from subdir.png",
        "other/not from dist.js": "not from dist.js"
      });
      test.strictEqual(result[1], "dist/package.json");
      test.done();
    }
  }
};
