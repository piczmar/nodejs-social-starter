var ObjectID = require('mongodb').ObjectID,
    assert = require('assert');

function CommentsDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
    * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof CommentsDAO)) {
        console.warn('Warning: CommentsDAO constructor called without "new" operator');
        return new CommentsDAO(db);
    }

    var comments = db.collection("comments");

    this.add = function(data, callback) {
        "use strict";
        data.createdAt = new Date();

        comments.insert(data, function(err, docs) {
            if (err) return callback(err, null);

            console.log("Inserted " + JSON.stringify(docs));
            callback(err, docs[0]);
        });

    }

    this.getAll = function(criteria, skip, limit, sortSpec, callback) {
        "use strict";
        var projections = {
        };
        var sort = sortSpec ?  JSON.parse(sortSpec) : {'updatedAt': -1}

        console.log("criteria: " + JSON.stringify(criteria));
        console.log("skip: " + skip);
        console.log("limit: " + limit);
        console.log("sort: " + JSON.stringify(sort));
        
        comments.find(criteria, projections).sort(sort).skip(skip).limit(limit).toArray(function(err, comments) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found " + comments.length + " comments");
            callback(err, comments);
        });

    }

    this.get = function(id, callback) {
        "use strict";
        var projections = {
        };
        var commentId = new ObjectID(id);
        comments.findOne({_id : commentId}, projections , function(err, comment) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found comment " + JSON.stringify(comment));
            callback(err, comment);
        });

    }
    this.update = function(id, data, callback) {
        "use strict";
        var commentId = new ObjectID(id);
        data.updatedAt = new Date();;
        console.log("Updating " + JSON.stringify(data));
        comments.update({_id: commentId}, data, function(err, numberOfUpdatedDocs) {
            if (err) return callback(err, null);

            console.log("Updated " + numberOfUpdatedDocs);
            callback(err, numberOfUpdatedDocs);
        });

    }
    this.remove = function(id, userId, callback) {
        "use strict";

        var commentId = new ObjectID(id);

        comments.remove({_id: commentId}, function(err, numberOfRemovedDocs) {
            if (err) return callback(err, null);
			assert.equal(1, numberOfRemovedDocs);
            console.log("Removed " + commentId);
            callback(err, numberOfRemovedDocs);
        });
    }

}

module.exports.CommentsDAO = CommentsDAO;