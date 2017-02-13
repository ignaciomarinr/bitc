var express = require('express');
var router = express.Router();

var apiController = require('../controllers/api_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'BITC' });
});

router.get('/api', apiController.api);

module.exports = router;
