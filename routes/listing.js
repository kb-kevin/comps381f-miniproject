var express = require('express');
var router = express.Router();
var expressMongoDb = require("express-mongo-db");
var assert = require("assert");
var url = require("url");
var cookieParser = require("cookie-parser");
var formidable = require("formidable");
var MongoClient = require('mongodb').MongoClient;
var mongourl = "mongodb://admin:admin1@ds137263.mlab.com:37263/s381f-project";
var bodyParser = require('body-parser');

const ObjectID = require("mongodb").ObjectID;
router.use(
	expressMongoDb(
		"mongodb://admin:admin1@ds137263.mlab.com:37263/s381f-project"
		)
	);

router.use(
  cookieParser(),
  expressMongoDb(
    "mongodb://admin:admin1@ds137263.mlab.com:37263/s381f-project"
  )
);

router.get('/logout', function(req, res) {
	req.session = null;
	res.redirect('/');
});

router.get('/', function(req, res, next){
	
	var criteria = {} ;
	
	find(req.db, criteria, function(restaurants){
		res.render('listing', {
			restaurants: restaurants,
			userID: req.session.userID
		});
	});
});

router.get('/map', function(req, res, next) {
	
	res.render("googlemap.ejs", {
		lat: req.query.lat,
		lon: req.query.lon,
		zoom: req.query.zoom
	});
});

router.get('/search', function(req, res) {
	var key = req.query.key;
	var value = req.query.value;
	var criteria = {};
	switch (key) {
		case 'Name':
			criteria = { Name: value };
			break;
		case 'borough':
			criteria = { borough: value };
			break;
		case 'cuisine':
			criteria = { cuisine: value };
			break;
		default:
			break;
	}
	var projection = { "_id": 1, "Name": 1 };
	if (!req.session.authenticated) {
		res.redirect('/login');
	}
	else {
		if (value != null || value!= undefined) {
			MongoClient.connect(mongourl, function(err, db) {
				assert.equal(err, null);
				readRestaurant(db, criteria, projection, function(result) {
					db.close();
					res.render('search', { name: req.session.userID, result });
				});
			});
		}
		else {
			res.writeHead(200, { "Content-Type": "text/html" });
			res.write("Invalid search<br />");
			res.end("<a href='/listing'>Back to Home Page</a>");
		}

	}
});

function readRestaurant(db, criteria, projection, callback) {
	var cursor = db.collection("Restaurants").find(criteria, projection);
	var restaurant = [];
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			restaurant.push(doc);
		}
		else {
			callback(restaurant);
		}
	});
}
function find(db, criteria, callback) {
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

router.post('/rate', function(req, res) {
	var user = req.body.user;
	var score = req.body.score;
	var id = req.body.id;
	var view_id = req.body.id;
	var criteria = { id : id };
	var read_criteria = { 'id': id, 'grades.user': user };
	var set = { 'grades': { 'user': user, 'score': score } };
	var rateRestaurants = function(db, callback) {
		db.collection('Restaurants').updateOne(criteria, { $push: set },
			function(err, results) {
				console.log(results);
				callback();
			}
		);
	};
	if (true) {
		MongoClient.connect(mongourl, function(err, db) {
			assert.equal(null, err);
			readRestaurant(db, read_criteria, { 'grades.user': 1 }, function(result) {
				console.log('JSON : ' + JSON.stringify(result)+ result.length);
				if (result.length > 0) {
					console.log('Rated!');
					res.writeHead(200, { "Content-Type": "text/html" });
					res.write("<h1>You have rated Already!</h1><br />");
					res.write("<a href=\"/listing>Submit</a>");
					res.end();
				}
				else {
					rateRestaurants(db, function() {
						db.close();
						console.log('Rated!');
						res.writeHead(200, { "Content-Type": "text/html" });
						res.write("<h1>Rate completed!</h1><br />");
						res.write("<a href=\"/\">Back to Home Page</a>");
						res.end();
					});
				}
				db.close();
			});
		});
	}
	else {
		res.writeHead(200, { "Content-Type": "text/html" });
		res.write("<h1>Invalid Score</h1><br />");
		res.write("<a href=\"/listing>Submit</a>");
		res.end();
	}

});
module.exports = router;