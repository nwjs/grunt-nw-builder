'use strict';

// Test Setup
var assert = require('chai').assert,
    tmp = require('tmp'),
    sinon = require('sinon'),
    grunt = require('grunt'),
    util = require('../tasks/lib/utils')(grunt);

describe('The utility library', function() {


    it('getFileList: should generate a valid fileList for default', function() {
      var files = grunt.task.normalizeMultiTaskFiles({
        src: ['test/fixtures/utils/get_file_list/default/**/**']
      }), expected = [
        [{
          src: 'test/fixtures/utils/get_file_list/default/images/imagefile', dest: 'images/imagefile'
        }, {
          src: 'test/fixtures/utils/get_file_list/default/javascript/bower_packages/simple/package.json', dest: 'javascript/bower_packages/simple/package.json'
        }, {
          src: 'test/fixtures/utils/get_file_list/default/javascript/jsfile', dest: 'javascript/jsfile'
        }, {
          src: 'test/fixtures/utils/get_file_list/default/node_modules/package/package.json', dest: 'node_modules/package/package.json'
        }, {
          src: 'test/fixtures/utils/get_file_list/default/package.json', dest: 'package.json'
        }],
        'test/fixtures/utils/get_file_list/default/package.json'
      ], actual = util.getFileList(files);

      assert.deepEqual(expected, actual);

    });


    it('getPackageInfo: should fail if there is no valid json', function() {
      var warn = grunt.fail.warn;
      grunt.fail.warn = sinon.spy();
      var pkg = util.getPackageInfo('test/fixtures/utils/invalid_package.json');
      assert.ok(grunt.fail.warn.called);
      grunt.fail.warn = warn;
    });


    it('closerPathDepth: should give back the shortest path', function() {
      var path1 = 'this/is/a/path/',
          path2 = 'this/is/a/longer/path/';

      assert.equal(path1, util.closerPathDepth(path1, path2));
    });

    it('pathDepth: should return the length of a path', function() {
      assert.equal(6, util.pathDepth('this/is/a/longer/path/'));
    });


    it('generatePlist: should generate a valid Plist file', function(done) {
      var options = {
        app_version: '1.0',
        app_name: 'test',
        copyright: '2013'
      };

      tmp.file(function(err, target_filename) {
        util.generatePlist('test/fixtures/utils/plist.pls', target_filename, options);
        assert.equal(grunt.file.read(target_filename), grunt.file.read('test/expected/utils/plist_edited.pls'));
        done();
      });

    });

});