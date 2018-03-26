import {PhotosDAO} from "./dao";
import {CommentsDAO} from '../comments/dao';

"use strict";

export class PhotosController {

    constructor(db) {
        this.dao = new PhotosDAO(db);
        this.commentsDAO = new CommentsDAO(db);
    }


    upload(req, res, next) {
		"use strict";

		var pathOnDisk = req.files.raw_data.path;
		var metadata = req.params;
        this.dao.upload(pathOnDisk, metadata, function (err, photoId) {
			"use strict";

			if (err)
				return next(err);

			res.setHeader("Content-Type", "application/json");
			res.end(JSON.stringify({id : photoId}));
			return next();
		});

	}

    get(req, res, next) {
		"use strict";
        this.dao.get(req.params.id, function (err, fileData) {
			"use strict";

			if (err)
				return next(err);
		
        	res.setHeader("Content-Type", "image/png");
        	res.send(fileData);
        	console.log("Download complete for "+ req.params.id +" , file size " + fileData.length + " bytes");
        	return next();
       	});
	}

    getMeta(req, res, next) {
		"use strict";

        this.dao.getMetadata(req.params.id, function (err, meta) {
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send(meta);
	      	return next();
	    });
       
	}

    updateMeta(req, res, next) {
		"use strict";

        this.dao.updateMetadata(req.params.id, req.params, function (err, result) {
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send();
	      	return next();
	    });
       
	}

    remove(req, res, next) {
		"use strict";

        this.dao.remove(req.params.id, function (err, result) {
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	console.log("Removed file " + req.params.id );
	      	
	      	res.setHeader("Content-Type", "application/json");
	      	res.send();
	      	return next();
	    });
       
	}

    getAllMeta(req, res, next) {
		"use strict";
		console.log("GET ALL META");
		var max = parseInt(req.query.max);
		var limit = max ? max : 10;
      	delete req.query.max; // remove max param and use other query params as criteria for search
      	var skip = parseInt(req.query.skip);
      	var skip = skip ? skip : 0;
      	delete req.query.skip; // remove skip param and use other query params as criteria for search

      	var criteria = req.query;

        this.dao.getAllMetadata(criteria, skip, limit, null, function (err, items) {
      		"use strict";

      		if (err)
      			return next(err);

      		res.setHeader("Content-Type", "application/json");
      		res.send(items);
      		return next();
      	});
      
  	}

    addLike(req, res, next) {
		"use strict";
		var userId = req.params.userId;
		var photoId = req.params.id;


        this.dao.addLikes(photoId, userId, function (err, meta) {
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send();
	      	return next();
	    });
	}

    deleteLike(req, res, next) {
		"use strict";
		var userId = req.params.userId;
		var photoId = req.params.id;


        this.dao.deleteLikes(photoId, userId, function (err, meta) {
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send();
	      	return next();
	    });
	}

    addDislike(req, res, next) {
		"use strict";
		var userId = req.params.userId;
		var photoId = req.params.id;


        this.dao.addDislikes(photoId, userId, function (err, meta) {
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send();
	      	return next();
	    });
	}

    deleteDislike(req, res, next) {
		"use strict";
		var userId = req.params.userId;
		var photoId = req.params.id;


        this.dao.deleteDislikes(photoId, userId, function (err, meta) {
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send();
	      	return next();
	    });
	}

    getLikesCount(req, res, next) {
		"use strict";
		var id = req.params.id
        this.dao.getLikesCount(id, function (err, count) {
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send({ cnt: count });
	      	return next();
	    });
       
	}

    getDislikesCount(req, res, next) {
		"use strict";
		var id = req.params.id
        this.dao.getDislikesCount(id, function (err, count) {
	      	"use strict";

	      	if (err)
	      		return next(err);

	      	res.setHeader("Content-Type", "application/json");
	      	res.send({ cnt: count });
	      	return next();
	    });
       
	}

    getComments(req, res, next) {
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


        this.commentsDAO.getAll(criteria, skip, limit, sortSpec, function (err, items) {
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