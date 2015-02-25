require('shelljs/global');

var Q = require('q'),
    logger = require('./logger');

module.exports = {
  deploy: deployToParse
}

function deployToParse(config) {
  var deferred = Q.defer();
    exec('parse deploy', function(code, output) {      
      if (code == 0) {
        logger.log("SUCCESS: Finished deployment of " + hexo.config.title.toUpperCase() + " to Parse.com!");
        deferred.resolve(code);  
      } else {
        logger.log("ERROR: Failure during deployment of " + hexo.config.title.toUpperCase() + " to Parse.com");
        deferred.reject(new Error("Deployment failed with a status code of " + code));
      }       
    });
  return deferred.promise;
};
