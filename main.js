var Q = require('q'),
    urlTester = require('./src/url-tester'),
    builder = require('./src/builder'),
    settingsManager = require('./src/settings-manager'),
    deployer = require('./src/deployer'),
    timeKeeper = require('./src/time-keeper')(settingsManager),
    browser = require('./src/browser');

hexo.extend.deployer.register('parse', function(args, callback){
    config = hexo.config.deploy;
    timeKeeper.begin(config, callback);
    builder.generateBuild(config);

    deployer.deploy(config).then(function(result) {

      successfulDeployment(config, result, callback);

    }).fail(function(err) {

      failedDeployment(err, callback);

    });
});

hexo.extend.generator.register('parse', function(locals, render, callback) {
  if (hexo.config.deploy.url_tests.check_posts) {

    var generator = require('./src/post-generator');

    generator.generatePosts(locals, callback);

  }
});

function successfulDeployment(config, result, callback) {
  urlTester.runTests(config).then(function(results) {
    settingsManager.saveNew(function(err) {
      if (err) {
        logAndThrowError('Error saving new settings file!', err);
      } else {
        openBrowserAndCancelTimeouts(config, callback);
      }
    });
  }).fail(function(err) {    
    logAndThrowError('Deployment failed when running URL tests.', err, callback);
  });
};

function logAndThrowError(errMsg, err, callback) {
  logger.log(errMsg);
  logger.log(err);
  if (callback) {
    callback();
  } else {
    throw new Error(err);
  }
}

function openBrowserAndCancelTimeouts(config, callback) {
  browser.openSite(config);
  timeKeeper.cancelTimeout();
  callback();
};

function failedDeployment(err, callback) {
  logAndThrowError('Deployment to Parse failed!', err, callback);
};









