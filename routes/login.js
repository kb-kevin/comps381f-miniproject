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

router.get("/", function(req, res) {
  console.log(req.session.authenticated);
  if (req.session.authenticated) {
    console.log("Logined");
    res.redirect("listing");
  } else {
    res.render("login");
  }
});

router.post("/", function(req, res, next) {
  var formData = req.body;
  req.db.collection("Users").findOne(formData, function(err, result) {
    assert.equal(err, null);
    if (result !== null) {
      console.log("result:" + result);
      req.session.authenticated = true;
      req.session.userID = result.userID;
      res.redirect("listing");
    } else {
      res.send("fail");
    }
  });
});

module.exports = router;