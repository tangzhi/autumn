var express = require('express');
var debug = require('debug')('autumn:web');

/* eslint-disable new-cap */
var router = express.Router();
/* eslint-enable new-cap */

exports = module.exports = router;

router
  .route('*')
  .get(function renderHtml(req, res) {
    debug('web get: %s , render index.html template.', req.originalUrl);
    res.sendFile(__dirname + '/web/index.html', { maxage: 0 });
  });
