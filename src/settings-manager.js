var logger = require('./logger');
var moment = require('moment');
var nconf = require('nconf');
var fs = require('fs');

var Parse;

module.exports = {
  initialize: initialLoad,
  saveNew: saveNewSettings
}

function saveNewSettings(callback) {  
  var filePath = settingsFilePath(); 
  logger.log("SAVING the NEW version of the settings file..." + filePath);
  nconf.file(filePath);

  var version = nconf.get('version');
  var updatedVersion = (parseInt(version) || 0) + 1;
  nconf.set('version', updatedVersion);

  var now = moment();
  nconf.set('last_deployed', prettyDate(now));

  var siteName = siteTitle();
  nconf.set('name', siteName);
    
  logger.log("Updated settings file from version " + version + " to version " + updatedVersion);

  return nconf.save(callback);
}

function initialLoad(configuration) {
  if (configuration.parse) {
    config = configuration.parse;

    logger.log("Loading the Parse SDK...");
    Parse = require('parse').Parse;
    Parse.initialize(config['app_id'], config['js_key']);  
    return true;
  } else {
    return false;
  }
};

function siteTitle() {
   var title = hexo.config.title.toLowerCase();
   return title.replace(' ', '');
}

function settingsFilePath() {
  var settingsFileRelPath = hexo.config.deploy.parse.settings_file;
  return process.cwd() + "/" + settingsFileRelPath;
};

function prettyDate(momentObj) {

  return momentObj.format("dddd, MMMM Do YYYY, h:mm:ss a");
};
