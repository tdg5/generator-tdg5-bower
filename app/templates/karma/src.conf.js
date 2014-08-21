var commonConfig = require('./common.conf'),
  files = require('../../files');

module.exports = function(config) {
  commonConfig(config);

  config.set({
    exclude: files.mergeFilesFor('karma-src-exclude'),
    files: files.mergeFilesFor('karma-src')
  });
};
