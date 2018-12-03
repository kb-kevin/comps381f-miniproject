var express = require("express");
var assert = require("assert");
var url = require("url");
var expressMongoDb = require("express-mongo-db");

var router = express.Router();

router.use(
  expressMongoDb(
    "mongodb://admin:admin1@ds137263.mlab.com:37263/s381f-project"
  )
);

router.post("/restaurant/create", function(req, res, next) {
  createRestaurant(req.db, req.body, function(result) {
    if (result == "failed") {
      res.json({ status: "failed" });
    } else {
      res.json({ status: "ok", _id: result.insertedId });
    }
  });
});

function createRestaurant(db, data, callback) {
  db.collection("Restaurants").insertOne(data, function(err, result) {
    if (err) {
      callback("failed");
    } else {
      callback(result);
    }
  });
}

/* GET /api/restaurant/read */
router.get("/restaurant/read/name/*", function(req, res, next) {
  var params = url.parse(req.url, true).query;
  var criteria = {};
  criteria.name = req.url.split("/").pop();
  findRestaurants(req.db, criteria, function(restaurants) {
    res.json(restaurants);
  });
});

router.get("/restaurant/read/borough/*", function(req, res, next) {
  var params = url.parse(req.url, true).query;
  var criteria = {};
  criteria.borough = req.url.split("/").pop();
  findRestaurants(req.db, criteria, function(restaurants) {
    res.json(restaurants);
  });
});

router.get("/restaurant/read/cuisine/*", function(req, res, next) {
  var params = url.parse(req.url, true).query;
  var criteria = {};
  criteria.cuisine = req.url.split("/").pop();
  findRestaurants(req.db, criteria, function(restaurants) {
    res.json(restaurants);
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
module.exports = router;