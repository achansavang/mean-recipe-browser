
 
var mongodb = require('mongodb').MongoClient;

mongodb.connect("mongodb://localhost:27017/test", function(err, db) {
	if (err) console.log(err);

	console.log("connected to mongodb");
	
	var express = require('express');
	var path = require('path');
	var cookieParser = require('cookie-parser');
	var logger = require('morgan');
	var bodyParser = require('body-parser');
	 
	var app = express();
	 
	// view engine setup
	// app.set('views', path.join(__dirname, 'views'));
	// app.set('view engine', 'ejs');
	// app.engine('html', require('ejs').renderFile);
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
	    extended: false
	}));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));
	 
	// Make our db accessible to our router
	app.use(function(req,res,next){
	    req.db = db;
	    next();
	});

	// app.use('/recipes', recipes);

	// routes
	app.get('/:collection(recipes|recipes-totalTimeOrder)/:nPerPage/:pageNumber/:filter*?', function(req, res, next) {
	    var pageNumber = parseInt(req.params.pageNumber);
	    var nPerPage = parseInt(req.params.nPerPage);
	    var source = req.params.filter === undefined ? "" : req.params.filter;

	    var filter = {};
	    if (source !== "")
	    	filter = {source: source};

	    var recipes_collection = db.collection(req.params.collection);
	    recipes_collection.find(filter)
	    	.skip(pageNumber > 0 ? ((pageNumber-1)*nPerPage) : 0)
	    	.limit(nPerPage).toArray(function(err, docs) {
		    	res.json(docs);
	    	});
	});

	app.get('/:collection(recipes|recipes-totalTimeOrder)/count/:filter*?', function(req, res, next) {
	    var recipes_collection = db.collection(req.params.collection);
	    var source = req.params.filter === undefined ? "" : req.params.filter;

	    var filter = {};
	    if (source !== "")
	    	filter = {source: source};
	    
	    var result;
	    recipes_collection.count(filter, function(err, count) {
	    	res.json(count);
    	});
	});

	// // catch 404 and forward to error handler
	// app.use(function(req, res, next) {
	//     var err = new Error('Not Found');
	//     err.status = 404;
	//     next(err);
	// });
	 
	app.use( express.static(__dirname) );

	app.listen(3000, function() {
	    console.log('Server listening on port 3000!');
	});
	 
	module.exports = app;
});
