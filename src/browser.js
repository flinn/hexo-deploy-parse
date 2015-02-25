var logger = require('./logger');

module.exports = {
  openSite: openConfiguredSite
}

function openConfiguredSite(config) {
    logger.log('Opening deployed site in browser window.');
    if (typeof config.load_in_browser == 'boolean') {
      require('openurl').open(hexo.config.url);  
    } else {
      require('openurl').open(config.load_in_browser);
    }    
};