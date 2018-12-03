var express = require('express');
var router = express.Router();
var expressMongoDb = require("express-mongo-db");
var assert = require("assert");
var url = require("url");
var MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
var mongourl = "mongodb://admin:admin1@ds137263.mlab.com:37263/s381f-project";
router.use(
  expressMongoDb(
    "mongodb://admin:admin1@ds137263.mlab.com:37263/s381f-project"
  )
);
router.get('/', function(req, res, next) {

  var criteria = { owner : req.session.userID};

  findRestaurants(req.db, criteria, function(restaurants) {
    res.render('self', {
    restaurants: restaurants,
    userID: req.session.userID
    });
  });

});
router.get("/delete", function(req, res, next) {
    var params = url.parse(req.url, true).query;
    var criteria = { ID : params.id };
    removeRestaurant(req.db, criteria, function(result) {
      if (result) {
        res.redirect("/listing");
      }
  });
});

router.get("/edit", function(req, res, next) {
    var params = url.parse(req.url, true).query;
    var criteria = { ID : params.id };
    findRestaurants(req.db, criteria, function(restaurants) {
      res.render('edit', {
      restaurants: restaurants,
      userID: req.session.userID
      });
    });
});

function findRestaurants(db, criteria, callback) {
  var cursor = db.collection("Restaurants").find(criteria);
  var restaurants = [];
  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      restaurants.push(doc);
    } else {
      callback(restaurants);
    }
  });
}

function removeRestaurant(db, criteria, callback) {
  db.collection("Restaurants").remove(criteria, function(err, res) {
    assert.equal(err, null);
    callback(true);
  });
}

module.exports = router;