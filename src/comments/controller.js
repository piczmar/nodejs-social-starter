var CommentsDAO = require('./dao').CommentsDAO;

/* The ContentHandler must be constructed with a connected db */
function CommentsController (db) {
	"use strict";

	var dao = new CommentsDAO(db);

	this.add = function(req, res, next) {
		"use strict";

		dao.add(req.params, function(err, result) {
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	console.log("Created " + result);
	      	
	      	res.setHeader("Content-Type", "application/json");
	      	res.send(result);
	      	return next();
	    });
       
	}

	this.remove = function(req, res, next) {
		"use strict";

		dao.remove(req.params.id, function(err, result) {
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	console.log("Removed " + req.params.id );
	      	
	      	res.setHeader("Content-Type", "application/json");
	      	res.send();
	      	return next();
	    });
       
	}
	this.get = function(req, res, next) {
		"use strict";

		dao.get(req.params.id, function(err, comment) {
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send(comment);
	      	return next();
	    });
       
	}
	this.getAll = function(req, res, next) {
		"use strict";
		var max = parseInt(req.query.max);
		var limit = max ? max : 10;
      	delete req.query.max; // remove max param and use other query params as criteria for search
      	var skip = parseInt(req.query.skip);
      	var skip = skip ? skip : 0;
      	delete req.query.skip; // remove skip param and use other query params as criteria for search
      	var sortSpec = req.params.sort
      	delete req.query.sort;

      	var criteria = req.query;

      	dao.getAll(criteria, skip, limit, sortSpec,function(err, items) {
      		"use strict";

      		if (err)
      			return next(err);

      		res.setHeader("Content-Type", "application/json");
      		res.send(items);
      		return next();
      	});
      
  	}

	this.update = function(req, res, next) {
		"use strict";
		var commentId = req.params.id;


		dao.update(commentId, req.params, function(err, result){ 
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send(200);
	      	return next();
	    });
	}
}
module.exports = CommentsController;