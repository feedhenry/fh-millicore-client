var millicoreClient;
var _ = require('underscore');
var logger = require('./lib/util/logger');

module.exports = function(config){

  //Only need a single instance of the millicore client.
  if(_.isObject(millicoreClient)){
    return millicoreClient;
  }

  millicoreClient =  {
    adminprops : require('./lib/adminprops')(config),
    apikeys : require('./lib/apikeys')(config),
    app : require('./lib/app')(config),
    appprops : require('./lib/appprops')(config),
    businessObjects : require('./lib/businessObjects')(config),
    cache : require('./lib/cache')(config),
    domainprops : require('./lib/domainprops')(config),
    envvars : require('./lib/envvars')(config),
    misc : require('./lib/misc')(config),
    project : require('./lib/project')(config),
    repos: require('./lib/repos')(config),
    service : require('./lib/services')(config),
    ssh : require('./lib/ssh')(config),
    templates : require('./lib/templates')(config),
    user : require('./lib/user')(config),
    userprops : require('./lib/userprops')(config),
    events: require('./lib/events')(config),
    alerts: require('./lib/alerts')(config),
    notifications: require('./lib/notifications')(config),
    formsNotification:require('./lib/forms_notifications')(config)
  };

  return millicoreClient;
};

module.exports.setLogger = logger.setLogger;
