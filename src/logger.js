module.exports = { 
  log: consoleLog
}

function consoleLog(args) {
  if (args && typeof(args) != 'undefined') {
    if (typeof(args) == 'string' && args.indexOf('---') != 0) {
      console.log('[hexo-deploy-parse] ' + args);
    } else if (typeof(args) == 'Object') {
      var argString = JSON.stringify(args, null, 2);
      var newLog = '[hexo-deploy-parse] ' + argString;     
      console.log(newLog)
    }
  } else {
    console.log(args);
  }
}