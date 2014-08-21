module.exports = function(config) {
  config.set({
    autoWatch: false,
    basePath: '../../',
    browsers: ['PhantomJS'],
    captureTimeout: 60000,
    colors: true,
    exclude: [],
    frameworks: ['jasmine'],
    logLevel: config.LOG_INFO,
    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-phantomjs-launcher'
    ],
    port: 9876,
    reporters: ['dots'],
    runnerPort: 9100,
    singleRun: false
  });
};
