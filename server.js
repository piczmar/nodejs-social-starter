var restify = require('restify'),
	util = require('util'), 
	MongoClient = require('mongodb').MongoClient,
	assert = require('assert'),

	photos  = require('./photos'),
	users  = require('./users'),
	comments  = require('./comments');

// read this for more info: http://micheljansen.org/blog/entry/1698
if (process.env.NODE_ENV === 'production') {
	var nullfun = function () {};
	console.log = nullfun;
	console.info = nullfun;
	console.error = nullfun;
	console.warn = nullfun;
}

var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser({ mapParams: true }));



server.get("/", function (req, res, next) {
	res.writeHead(200, {
		'Content-Type': 'application/json; charset=utf-8'
	});
	res.end(JSON.stringify("It works!!"));
	return next();

});
server.get('/api', function(req, res){
  res.send({routes: server.router.mounts });
});

var url = 'mongodb://admin:admin123@ds031561.mongolab.com:31561/ootb';
MongoClient.connect(url, function(err, db) {	
	"use strict";
	assert.equal(null, err);

	photos(server, db);
	users(server, db);
	comments(server, db);

	var PORT = process.env.PORT || 5000;
	server.listen(PORT, function () {
		require('./document')(server.router.mounts, 'restify');
		console.log("Server started @ " + PORT);
	});

});



module.exports = server;