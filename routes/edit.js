var express = require('express');
var router = express.Router();
var expressMongoDb = require("express-mongo-db");
var formidable = require("formidable");
var assert = require('assert');
var bodyParser = require("body-parser");
var fs = require("fs");
var url = require("url");
var mongourl = "mongodb://admin:admin1@ds137263.mlab.com:37263/s381f-project";
var MongoClient = require('mongodb').MongoClient;
router.get("/", function(req, res, next) {
  res.redirect("/self");
});
    
router.post("/", function(req, res, next) {

  var formData = req.body;
  var form = new formidable.IncomingForm();
  var upload_json = {};
  var filter = {};

  form.parse(req, function(err, fields, files) {

    filter = { ID: fields.id };

    upload_json["ID"] = fields.id;
    upload_json["Name"] = fields.name;
    upload_json["borough"] = fields.borough;
    upload_json["cuisine"] = fields.cuisine;
    upload_json["photo_mimetype"] = files.photo.type;
    (upload_json["address"] = {
      street: fields.street,
      building: fields.building,
      zipcode: fields.zipcode
    }),
      (upload_json["coord"] = {
        Latitude: fields.Latitude,
        Longitude: fields.Longitude
      });
    upload_json["owner"] = req.session.userID;

    if (files.photo.size != 0) {
      var filename = files.photo.path;

      fs.readFile(filename, function(err, data) {
        assert.equal(err, null);
        upload_json["photo"] = new Buffer(data).toString("base64");
        editRestaurant(req.db, filter, upload_json, function(result) {
          res.redirect("/self");
        });
      });
    } else {
      editRestaurant(req.db, filter, upload_json, function(result) {
        res.redirect("/self");
      });
    }
  });
});




function editRestaurant(db, filter, data, callback) {
  MongoClient.connect(mongourl, function(err, db) {
  db.collection("Restaurants").update(filter, { $set: data }, function(
    err,
    result
  ) {
    assert.equal(err, null);
    callback(result);
  });
});
}

module.exports = router;
