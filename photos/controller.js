var PhotosDAO = require('./dao').PhotosDAO;
var CommentsDAO = require('../comments/dao').CommentsDAO;
/* The ContentHandler must be constructed with a connected db */
function PhotosController (db) {
	"use strict";

	var dao = new PhotosDAO(db);
	var commentsDAO = new CommentsDAO(db);

	this.upload = function(req, res, next) {
		"use strict";

		var pathOnDisk = req.files.raw_data.path;
		var metadata = req.params;
		dao.upload(pathOnDisk, metadata, function(err, photoId) {
			"use strict";

			if (err)
				return next(err);

			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify({id : photoId}));
			return next();
		});

	}

	this.get = function(req, res, next) {
		"use strict";
		dao.get(req.params.id, function(err, fileData) {
			"use strict";

			if (err)
				return next(err);
		
        	res.setHeader("Content-Type", "image/png");
        	res.send(fileData);
        	console.log("Download complete for "+ req.params.id +" , file size " + fileData.length + " bytes");
        	return next();
       	});
	}

	this.getMeta = function(req, res, next) {
		"use strict";

		dao.getMetadata(req.params.id, function(err, meta) {
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send(meta);
	      	return next();
	    });
       
	}
	this.updateMeta = function(req, res, next) {
		"use strict";

		dao.updateMetadata(req.params.id, req.params, function(err, result) {
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send();
	      	return next();
	    });
       
	}
	this.remove = function(req, res, next) {
		"use strict";

		dao.remove(req.params.id, function(err, result) {
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	console.log("Removed file " + req.params.id );
	      	
	      	res.setHeader("Content-Type", "application/json");
	      	res.send();
	      	return next();
	    });
       
	}

	this.getAllMeta = function(req, res, next) {
		"use strict";
		console.log("GET ALL META");
		var max = parseInt(req.query.max);
		var limit = max ? max : 10;
      	delete req.query.max; // remove max param and use other query params as criteria for search
      	var skip = parseInt(req.query.skip);
      	var skip = skip ? skip : 0;
      	delete req.query.skip; // remove skip param and use other query params as criteria for search

      	var criteria = req.query;

      	dao.getAllMetadata(criteria, skip, limit, null,function(err, items) {
      		"use strict";

      		if (err)
      			return next(err);

      		res.setHeader("Content-Type", "application/json");
      		res.send(items);
      		return next();
      	});
      
  	}
  	this.addLike = function(req, res, next) {
		"use strict";
		var userId = req.params.userId;
		var photoId = req.params.id;


		dao.addLikes(photoId, userId, function(err, meta){ 
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send();
	      	return next();
	    });
	}
	this.deleteLike = function(req, res, next) {
		"use strict";
		var userId = req.params.userId;
		var photoId = req.params.id;


		dao.deleteLikes(photoId, userId, function(err, meta){ 
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send();
	      	return next();
	    });
	}
	this.addDislike = function(req, res, next) {
		"use strict";
		var userId = req.params.userId;
		var photoId = req.params.id;


		dao.addDislikes(photoId, userId, function(err, meta){ 
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send();
	      	return next();
	    });
	}
	this.deleteDislike = function(req, res, next) {
		"use strict";
		var userId = req.params.userId;
		var photoId = req.params.id;


		dao.deleteDislikes(photoId, userId, function(err, meta){ 
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send();
	      	return next();
	    });
	}
  	this.getLikesCount = function(req, res, next) {
		"use strict";
		var id = req.params.id
		dao.getLikesCount(id, function(err, count) {
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send({ cnt: count });
	      	return next();
	    });
       
	}
  	this.getDislikesCount = function(req, res, next) {
		"use strict";
		var id = req.params.id
		dao.getDislikesCount(id, function(err, count) {
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send({ cnt: count });
	      	return next();
	    });
       
	}

	this.getComments = function(req, res, next) {
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
      	criteria.photoId = req.params.photoId


      	commentsDAO.getAll(criteria, skip, limit, sortSpec,function(err, items) {
      		"use strict";

      		if (err)
      			return next(err);

      		res.setHeader("Content-Type", "application/json");
      		res.send(items);
      		return next();
      	});
       
	}

}
module.exports = PhotosController;