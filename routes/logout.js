var express = require("express");
var url = require("url");
var expressMongoDb = require("express-mongo-db");
var assert = require("assert");
var cookieParser = require("cookie-parser");
var cookieSession = require("cookie-session");
var router = express.Router();

router.use(
  cookieParser(),
  expressMongoDb(
    "mongodb://admin:admin1@ds137263.mlab.com:37263/s381f-project"
  )
);
router.post('/logout', function(req, res, next) {
	req.session = null;
	res.redirect('/');
});
router.post('/', function(req, res, next) {
	req.session = null;
	res.redirect('/');
});
module.exports = router;