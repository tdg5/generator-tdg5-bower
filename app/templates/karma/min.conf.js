var commonConfig = require('./common.conf'),
  files = require('../../files');

module.exports = function(config) {
  commonConfig(config);

  config.set({
    files: files.mergeFilesFor('karma-min')
  });
};
