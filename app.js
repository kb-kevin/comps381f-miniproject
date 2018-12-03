var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var cookieSession = require("cookie-session");
var logger = require("morgan");
var mongourl = "mongodb://admin:admin1@ds137263.mlab.com:37263/s381f-project";
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var indexRouter = require('./routes/index');
var loginRouter = require("./routes/login");
var registerRouter = require('./routes/register');
var restaurantRouter = require('./routes/restaurant');
var listingRouter = require('./routes/listing');
var editRouter = require('./routes/edit');
var selfRouter = require('./routes/self');
var apiRouter = require('./routes/api');
var app = express();

var SECRETKEY1 = "I want to pass COMPS381F";
var SECRETKEY2 = "Keep this to yourself";

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  cookieSession({
    name: "session",
    keys: [SECRETKEY1, SECRETKEY2]
  }),
  logger("dev")
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use('/', indexRouter);
app.use("/login", loginRouter);
app.use('/register', registerRouter);
app.use('/restaurant', restaurantRouter);
app.use('/listing', listingRouter);
app.use('/edit', editRouter);
app.use('/self', selfRouter);
app.use('/api', apiRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;