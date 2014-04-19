'use strict';
/*global module:false*/
/*global require:false*/

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  var files = require('./files').files;

  // Project configuration.
  grunt.initConfig({
    builddir: 'build',
    pkg: grunt.file.readJSON('package.json'),
    buildtag: '-dev-' + grunt.template.today('yyyy-mm-dd'),
    meta: {
      banner: '/**\n' +
        ' * <%%= pkg.description %>\n' +
        ' * @version v<%%= pkg.version %><%%= buildtag %>\n' +
        ' * @link <%%= pkg.homepage %>\n' +
        ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
        ' */'
    },
    clean: [ '<%%= builddir %>' ],
    concat: {
      options: {
        banner: '<%%= meta.banner %>\n\n'+
                'if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){\n'+
                '  module.exports = \'<%= validVariableName %>\';\n'+
                '}\n\n'+
                '(function (window, undefined) {\n'+
                '"use strict";\n',
        footer: '})(window);',
        process: function(src, filepath) {
          return '// Source: ' + filepath + '\n' +
            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        },
      },
      build: {
        src: files.src,
        dest: '<%%= builddir %>/<%%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%%= meta.banner %>\n'
      },
      build: {
        files: {
          '<%%= builddir %>/<%%= pkg.name %>.min.js': ['<banner:meta.banner>', '<%%= concat.build.dest %>']
        }
      }
    },
    release: {
      files: ['<%%= pkg.name %>.js', '<%%= pkg.name %>.min.js'],
      src: '<%%= builddir %>',
      dest: 'release'
    },
    jshint: {
      beforeConcat: {
        src: ['Gruntfile.js', 'src/**/*.js']
      },
      afterConcat: {
        src: [ '<%%= concat.build.dest %>' ]
      },
      options: {
        boss: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        globalstrict: true,
        globals: {
          angular: true
        },
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        unused: true,
      }
    },
    watch: {
      files: ['./**/*.js'],
      tasks: ['build']
    },
    connect: {
      server: {},
      sample: {
        options:{
          port: 5555,
          keepalive: true
        }
      }
    },
    karma: {
      unit: {
        browsers: [ grunt.option('browser') || 'PhantomJS' ],
        configFile: 'config/karma/src.conf.js',
        singleRun: true
      },
      debug: {
        singleRun: false,
        background: false,
        configFile: 'config/karma/src.conf.js',
        browsers: [ grunt.option('browser') || 'Chrome' ]
      },
      build: {
        browsers: [ grunt.option('browser') || 'PhantomJS' ],
        configFile: 'config/karma/build.conf.js',
        singleRun: true
      },
      min: {
        browsers: [ grunt.option('browser') || 'PhantomJS' ],
        configFile: 'config/karma/min.conf.js',
        singleRun: true
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dest: 'dist',
          filter: 'isFile',
          flatten: true,
          src: ['build/*.js']
        }]
      }
    }
  });

  grunt.registerTask('default', ['karma:unit', 'build']);
  grunt.registerTask('build', 'Perform a normal build', ['jshint:beforeConcat', 'concat', 'jshint:afterConcat', 'karma:build', 'uglify', 'karma:min']);
  grunt.registerTask('dist', 'Perform a clean build', ['clean', 'build', 'copy:dist']);
};
