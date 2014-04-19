/*global __dirname, beforeEach, describe, it, require */
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;

describe('tdg5-bower generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'tmp'), function (err) {
      if (err) { return done(err); }

      this.app = helpers.createGenerator('tdg5-bower:app', ['../../app']);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      '.editorconfig',
      '.jshintrc',
      '.travis.yml',
      'Gruntfile.js',
      'LICENSE',
      'bower.json',
      'config/karma/build.conf.js',
      'config/karma/common.conf.js',
      'config/karma/min.conf.js',
      'config/karma/src.conf.js',
      'files.js',
      'package.json',
      'src/test.js',
      'test/test_test.js'
    ];

    helpers.mockPrompt(this.app, {
      rawName: 'test',
      description: 'test'
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      for(var i = 0; i < expected.length; i++) {
        helpers.assertFile(expected[i]);
      }
      done();
    });
  });
});
