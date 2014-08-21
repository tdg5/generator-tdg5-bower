var commonConfig = require('./common.conf'),
  files = require('../../files');

module.exports = function(config) {
  commonConfig(config);

  config.plugins.push('karma-coverage');
  config.reporters.push('coverage');
  config.set({
    coverageReporter: {
      dir: 'tmp/coverage',
      type: 'lcov'
    },
    exclude: files.mergeFilesFor('karma-src-exclude'),
    files: files.mergeFilesFor('karma-src'),
    preprocessors: {
      'src/**/*.js': 'coverage'
    }
  });
};
