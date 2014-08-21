'use strict';
/* global module, process, require */

module.exports = function (grunt) {
  var defaultTasks, files;

  require('load-grunt-tasks')(grunt);
  files = require('./files').files;

  grunt.initConfig({
    builddir: 'build',
    buildtag: '-dev-' + grunt.template.today('yyyy-mm-dd'),
    meta: {
      banner: '/**\n' +
      ' * <%%= pkg.description %>\n' +
      ' * @version v<%%= pkg.version %><%%= buildtag %>\n' +
      ' * @link <%%= pkg.homepage %>\n' +
      ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
      ' */'
    },
    pkg: grunt.file.readJSON('package.json'),

    /* Plugins */
    browserSync: {
      test: {
        bsFiles: {
          src : './**/*.js'
        },
        options: {
          proxy: 'localhost:9876',
          watchTask: true
        }
      }
    },
    clean: [ '<%%= builddir %>' ],
    concat: {
      build: {
        dest: '<%%= builddir %>/<%%= pkg.name %>.js',
        src: files.src
      },
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
      }
    },
    copy: {
      dist: {
        files: [{
          dest: 'dist',
          expand: true,
          filter: 'isFile',
          flatten: true,
          src: ['build/*.js']
        }]
      }
    },
    coveralls: {
      options: {
        coverage_dir: 'tmp/coverage',
        debug: false,
        dryRun: false,
        force: true,
        recursive: true
      }
    },
    jshint: {
      afterConcat: {
        src: ['<%%= concat.build.dest %>']
      },
      beforeConcat: {
        src: ['Gruntfile.js', 'src/**/*.js']
      },
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
    karma: {
      build: {
        browsers: [ grunt.option('browser') || 'PhantomJS' ],
        configFile: 'config/karma/build.conf.js',
        singleRun: true
      },
      debug: {
        autoWatch: true,
        background: false,
        browsers: [ grunt.option('browser') || 'Chrome' ],
        configFile: 'config/karma/src.conf.js',
        runnerPort: 9876,
        singleRun: false
      },
      min: {
        browsers: [ grunt.option('browser') || 'PhantomJS' ],
        configFile: 'config/karma/min.conf.js',
        singleRun: true
      },
      unit: {
        browsers: [ grunt.option('browser') || 'PhantomJS' ],
        configFile: 'config/karma/src.conf.js',
        singleRun: true
      }
    },
    uglify: {
      build: {
        files: {
          '<%%= builddir %>/<%%= pkg.name %>.min.js': ['<banner:meta.banner>', '<%%= concat.build.dest %>']
        }
      },
      options: {
        banner: '<%%= meta.banner %>\n'
      }
    },
    watch: {
      files: ['**/*.js'],
      tasks: ['default']
    }
  });

  defaultTasks = ['karma:unit', 'build'];

  /* Only submit coverage reports from travis */
  if(!!process.env.CI) { defaultTasks.push('coveralls'); }

  grunt.registerTask('default', defaultTasks);
  grunt.registerTask('build', 'Perform a normal build', ['jshint:beforeConcat', 'concat', 'jshint:afterConcat', 'karma:build', 'uglify', 'karma:min']);
  grunt.registerTask('dist', 'Perform a clean build', ['clean', 'build', 'copy:dist']);
  grunt.registerTask('syncTest', ['browserSync:test', 'watch']);
};
