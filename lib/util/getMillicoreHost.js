/**
 * @param  {object} cfg - configuration used for communication with fh-supercore
 * @param  {object} req - request
 * Returns internal url for millcore host
 */
module.exports = function getMillicoreHost(cfg, req) {
  if (req && req.headers && !req.headers.referer) {
    req.headers.referer = req.headers.host;
  }
  return cfg.url;
};

