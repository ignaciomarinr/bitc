var express = require('express');
var csv = require('express-csv');
var router = express.Router();

var apiController = require('../controllers/api_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'BITC' });
});

router.get('/api', apiController.api);

router.get('/csv', apiController.csv);

module.exports = router;
