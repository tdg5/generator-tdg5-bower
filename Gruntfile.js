'use strict';
/* global module, require */

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    jshint: {
      src: [
        'Gruntfile.js',
        'app/index.js',
        'test/*_test.js'
      ],
      options: {
        boss: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        globalstrict: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        unused: true,
      }
    },
    mochaTest: {
      test: {
        src: ['test/*_test.js']
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'mochaTest']);
};
