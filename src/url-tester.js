var logger = require('./logger');
var request = require('request');
var _ = require('underscore');
var Q = require('q');
var util = require('util');
var jf = require('jsonfile');

module.exports = {
  runTests: startTests
}

function startTests(config) {
  var cwdPath = process.cwd();
  logger.log("Starting tests from current directory == " + cwdPath);

  var deferred = Q.defer();

  logger.log('>>> RUNNING SMOKETESTS <<<');
  runTests(config).then(function(results) {
    testsFinished(results, deferred); 
  })
  .fail(function(err) {
    testsErrored(err, deferred);
  });

  return deferred.promise;
};

function runTests(config) {
  var deferred = Q.defer();
  var tests = [];
  var testUrls = getTestUrls(config);
  if (config.url_tests.check_posts) {
    var postUrls = collectPostUrls(config);
    testUrls = _.union(testUrls, postUrls);
  }
  _.each(testUrls, function(url) {
    tests.push(smokeTestUrl(url));
  });

  return Q.all(tests);
};

function testsFinished(results, deferred) {  
  outputTestResults(results);
  logger.log('>>> SMOKETESTS FINISHED <<<');
  deferred.resolve(results);
};

function logResult(result) {
  if (result.code == 200) {
    logger.log('[OK] URL is OK... [' + result.url + ']');
  } else {
    logger.log('[ERROR] URL is BROKEN!!! [' + result.url + ']');
  }
};

function testsErrored(err, deferred) {
  logger.log(err);
  deferred.reject(err);
};

function smokeTestUrl(url) {
  var deferred = Q.defer(),
      _url = url;

  logger.log("TESTING URL :: " + url);
  
  request(url, function (error, response, body) {
    if (!error && response) {
      var result = { 'url': _url, 'code': response.statusCode };    
      deferred.resolve(result);
    } else {
      logger.log("Request error: ", error);
      deferred.reject(error);
    }    
  });

  return deferred.promise;
};

function handleUrlResponse(result) {

  logResult(result);
};

function outputTestResults(results) {
  _.each(results, function(result){
    logResult(result);
  });
};

function getTestUrls(config) {
  var testUrls = [hexo.config.url];
  var relativePaths = config.url_tests.urls;
  _.each(relativePaths, function(path) {
    var fullUrl = hexo.config.url + '/' + path;
    testUrls.push(fullUrl);
  })
  return testUrls;
}

function collectPostUrls(config) {
  var file = process.cwd() + '/public/deployer/posts/list.json';
  var json = util.inspect(jf.readFileSync(file));
  return _.pluck(json.posts, 'permalink');
}