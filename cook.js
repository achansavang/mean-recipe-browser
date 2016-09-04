// Load data to DB - convert durations to seconds and sort

var json2mongo = require('json2mongo');
var moment = require('moment');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;

var recipes_array = [];

require('fs').readFileSync('./recipeitems-latest.json').toString().split(/\r?\n/).forEach(function(line){
	if (line !== "")
	{
	  	var r = JSON.parse(line, 'utf8');
		r = json2mongo(r);
		if (r.cookTime)
			r.cookTime = moment.duration(r.cookTime).as('seconds');
		if (r.prepTime)
			r.prepTime = moment.duration(r.prepTime).as('seconds');
		if (r.totalTime)
			r.totalTime = moment.duration(r.totalTime).as('seconds');
		else if(r.cookTime && r.prepTime)
			r.totalTime = r.cookTime + r.prepTime;
		else
			r.totalTime = 9999999;
		recipes_array.push(r);
	}

})


console.log("array length", recipes_array.length);


MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {

    if(err) throw err;

	var col = db.collection("recipes");

	col.insertMany( recipes_array, function(err, r) {
		console.log("finish");

		// Execute aggregate, notice the pipeline is expressed as an Array
	    var cursor = col.aggregate([
	        { $sort : {	totalTime : 1 }},
	        { $out : "recipes-totalTimeOrder" }
	      ], {allowDiskUse: true}, function(err) { console.log("err",err); });
	});

});