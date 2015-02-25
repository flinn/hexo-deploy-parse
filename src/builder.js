require('shelljs/global');

var _ = require('underscore');
    logger = require('./logger');

module.exports = {
  generateBuild: generateNewBuild
}

function generateNewBuild(config) {
    logger.log('Generating new build of ' + hexo.config.url + ' for deployment to Parse.com!'); 
    exc('hexo generate');
    copyDir('assets/img/*', 'public/img/');    
};

function copyDir(src, dest) {
    cp('-rf', src, dest);
    logger.log('Copied files from "' + src + '" (source folder) to "' + dest + '" (destination folder)');
};

function exc(command) {
    var result = exec(command);
    logger.log(result.output.stdout);
};