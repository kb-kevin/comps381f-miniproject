
var express = require("express");
var formidable = require("formidable");
var expressMongoDb = require("express-mongo-db");
var assert = require("assert");
var cookieParser = require("cookie-parser");
var cookieSession = require("cookie-session");
var router = express.Router();
var fs = require("fs");
var bodyParser = require('body-parser');
var MongoClient = require("mongodb").MongoClient;
var url = require("url");

router.use(
  expressMongoDb(
    "mongodb://admin:admin1@ds137263.mlab.com:37263/s381f-project"
    )
    );
router.get('/', function(req, res, next) {
    res.render('restaurant');
});

function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max));
}

router.post('/', function(req, res, next) {
  var formData = req.body;
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
		var upload_json = {};
		    upload_json["ID"] = fields.name+fields.Latitude+fields.Longitude+getRandomInt(9999);
        upload_json["Name"] = fields.name;
        upload_json["borough"] = fields.borough;
        upload_json["cuisine"] = fields.cuisine;
        upload_json["address"] = {
            street: fields["street"],
            building: fields["building"],
            zipcode: fields["zipcode"],
            coord: {
        Latitude: fields.Latitude,
        Longitude: fields.Longitude
      }}
        upload_json["owner"] = req.session.userID;
        upload_json["grades"] = [];
        
	 if (files.photo.size != 0) {
      var filename = files.photo.path;
      upload_json["photo_mimetype"] = files.photo.type;
      fs.readFile(filename, function(err, data) {
        assert.equal(err, null);
        upload_json["photo"] = new Buffer(data).toString("base64");
        createRestaurant(req.db, upload_json, function(result) {
          res.redirect("/");
        });
      });
    } else {
      createRestaurant(req.db, upload_json, function(result) {
        res.redirect("/listing");
      });
    }
  });
});

function createRestaurant(db, data, callback) {
  db.collection("Restaurants").insertOne(data, function(err, result) {
    assert.equal(err, null);
    console.log(JSON.stringify(result));
    callback(result);
  });
}
module.exports = router;