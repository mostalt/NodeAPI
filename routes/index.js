var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//example
router.get('/ErrorExample', function(req, res, next){
  next(new Error('Random error!'));
});

module.exports = router;
