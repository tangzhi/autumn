var debug = require('debug')('autumn:service');
var join = require('path').join;
var read = require('fs').readFileSync;
var express = require('express');
/* eslint-disable  new-cap */
var router = express.Router();
/* eslint-enable */

// debug content begin
var debugPath = join(__dirname, 'web', 'service', 'auth');
var debugAuthContent = read(debugPath, { encoding: 'utf8' });
// debug content end

exports = module.exports = router;

router.use(function timeLog(req, res, next) {
  debug('Time[%d]: originalUrl:%s, baseUrl:%s, path:%s, url:%s, _parsedUrl._raw:%s',
    Date.now(), req.originalUrl, req.baseUrl, req.path, req.url, req._parsedUrl._raw);
  next();
});

router
  .route('/auth')
  // auth model create operate
  .post(function userLogin(req, res) {
    var user = {};

    debug('/auth post: %s', JSON.stringify(req.body));
    if (!req.body || req.body.name !== 'admin' || req.body.password !== '123456') {
      res.json({
        auth: false,
        login_err_count: req.body.login_err_count ? (req.body.login_err_count + 1) : 1
      }).end();
      // regenerate session
      req.session.regenerate(function nothing() {});
      return;
    }

    /* eslint-disable no-param-reassign */
    req.session.user = user;
    req.session.isAuth = true;
    /* eslint-enable no-param-reassign */

    res.end(debugAuthContent);
  })
  .get(function fetchAuth(req, res) {
    debug('request.session:%s', JSON.stringify(req.session));

    if (req.session && req.session.isAuth === true) {
      res.end(debugAuthContent);
    } else {
      res.json({ auth: false }).end();
    }
  });
