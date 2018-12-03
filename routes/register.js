var express = require("express");
var url = require("url");
var expressMongoDb = require("express-mongo-db");
var assert = require("assert");
var cookieParser = require("cookie-parser");
var router = express.Router();
var mongourl = "mongodb://admin:admin1@ds137263.mlab.com:37263/s381f-project";
var MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID

router.use(expressMongoDb(mongourl));
router.get("/", function(req, res, next) {
  var parsedURL = url.parse(req.url, true);
  console.log(parsedURL);
  res.render("register");
});

router.post("/", function(req, res, next) {
  var formData = req.body;
  req.db.collection("Users", function(err, collection) {
    collection.insertOne(
      { userID: formData.username, password: formData.password },
      function(err, result) {
        assert.equal(err, null);
        console.log("User Registration Successful!");
        res.redirect("/login");
      }
    );
  });
});
module.exports = router;