var moment = require('moment'),
    settingsManager,
    deploymentMonitor,
    startTime,
    endTime;

module.exports = function(settingsMngr) {
  settingsManager = settingsMngr;
  return {
    begin: startDeploymentTimer,
    cancelTimeout: cancelDeploymentMonitor
  }
}

function startDeploymentTimer(config, callback) {
  startTime = new moment();
  console.log("Deployment started at " + prettyDate(startTime));

  deploymentMonitor = setTimeout(function() {
    console.log("ERROR: Deployment Timeout!");
    settingsManager.saveNew();
    callback();
  }, config.deployment_timeout * 1000);
}

function cancelDeploymentMonitor() {
  endTime = new moment();
  console.log("Deployment ended at " + prettyDate(endTime));
  
  clearTimeout(deploymentMonitor);
}

function prettyDate(momentObj) {
  return momentObj.format("dddd, MMMM Do YYYY, h:mm:ss a");
}