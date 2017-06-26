var PhotosDAO = require('../photos/dao').PhotosDAO;

/* The ContentHandler must be constructed with a connected db */
function UsersController (db) {
	"use strict";

	var photos = new PhotosDAO(db);

	
	this.getPhotos = function(req, res, next) {
		"use strict";
		var userId = req.params.userId;

		var max = parseInt(req.query.max);
		var limit = max ? max : 10;
      	delete req.query.max; // remove max param and use other query params as criteria for search
      	var skip = parseInt(req.query.skip);
      	var skip = skip ? skip : 0;
      	delete req.query.skip; // remove skip param and use other query params as criteria for search
      	var sortSpec = req.params.sort
      	delete req.query.sort;

      	var criteria = req.query;

      	// adjust user id to GridFS document properties

      	criteria['metadata.userId'] = userId;
      
      	photos.getAllMetadata(criteria, skip, limit, sortSpec, function(err, items) {
      		"use strict";

      		if (err)
      			return next(err);

      		res.setHeader("Content-Type", "application/json");
      		res.send(items);
      		return next();
      	});
      
  	}
}
module.exports = UsersController;