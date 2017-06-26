var fs = require('fs'),
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');

function PhotosDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
    * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof PhotosDAO)) {
        console.warn('Warning: PhotosDAO constructor called without "new" operator');
        return new PhotosDAO(db);
    }

    var photos = db.collection("fs.files");

    this.upload = function (pathOnDisk, metaData, callback) {
        "use strict";

        console.log("inserting photo from file path" + pathOnDisk );

        var fileId = new ObjectID();
        var fileName = "f"+fileId;
        var gridStore = new GridStore(db, fileId, fileName, "w", {metadata : metaData});

        gridStore.open(function(err, gridStore) {
            if (err) return callback(err, null);

            gridStore.writeFile(pathOnDisk, function(err, doc) {
                // clean local disk
                fs.unlink(pathOnDisk, function(error){
                    if(error) 
                        console.log("Cannot remove file: " + pathOnDisk);
                    console.log ("Cleanup file (OK) " + pathOnDisk);

                    if (err) 
                        return callback(err, null);

                    callback(err,fileId);

                });

            })
        });
    }

    this.get = function(id, callback) {
        var fileId = new ObjectID(id);

        GridStore.read(db, fileId, function(err, fileData) {
            callback(err, fileData);
        });
    }

    this.remove = function(id, callback) {
        var fileId = new ObjectID(id);
        var gridStore = new GridStore(db, fileId, "r");

        gridStore.open(function(err, gridStore) {
            if (err) return callback(err, null);
            // Unlink the file
            gridStore.unlink(function(err, result) {
                if (err) return callback(err, null);

                callback(err, result);
            });
        });
    }

    this.getAllMetadata = function(criteria, skip, limit, sortSpec, callback) {
        "use strict";
        var projections = {
            chunkSize : false,
            md5 : false,
            contentType : false, 
            aliases : false
        };
        var sort = sortSpec ?  JSON.parse(sortSpec) : {'uploadDate': -1}

        console.log("criteria: " + JSON.stringify(criteria));
        console.log("skip: " + skip);
        console.log("limit: " + limit);
        console.log("sort: " + JSON.stringify(sort));
        
        photos.find(criteria, projections).sort(sort).skip(skip).limit(limit).toArray(function(err, files) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found " + files.length + " files");
            callback(err, files);
        });

    }

    this.getMetadata = function(id, callback) {
        "use strict";
        var projections = {
            chunkSize : false,
            md5 : false,
            contentType : false, 
            aliases : false
        };
        var fileId = new ObjectID(id);
        photos.findOne({_id : fileId}, projections , function(err, file) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found file " + JSON.stringify(file));
            callback(err, file);
        });

    }

    this.updateMetadata = function(id, meta, callback) {
        "use strict";
        var fileId = new ObjectID(id);
        photos.update({_id : fileId}, meta , function(err, numberOfUpdatedDocs) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Updated metadata " + numberOfUpdatedDocs);
            callback(err, numberOfUpdatedDocs);
        });

    }

    this.addLikes = function(id, userId, callback) {
        "use strict";

        var fileId = new ObjectID(id);

        /* userId will be added if not exists already */
        photos.findAndModify(
            {_id: fileId}, // query
            [['_id','asc']],  // sort order
            { $addToSet: { likes: userId} , $pull: { dislikes: userId} , $set: { updatedAt : new Date()}}, 
            {}, // options
            function(err, file) {
                if (err) return callback(err, null);

                console.log("Updated " + JSON.stringify(file));
                callback(err, file);
            });
    }
    this.addDislikes = function(id, userId, callback) {
        "use strict";

        var fileId = new ObjectID(id);

        /* userId will be added if not exists already */
        photos.findAndModify(
            {_id: fileId}, // query
            [['_id','asc']],  // sort order
            { $addToSet: { dislikes: userId} , $pull: { likes: userId}, $set: { updatedAt : new Date()} }, 
            {}, // options
            function(err, file) {
                if (err) return callback(err, null);

                console.log("Updated " + JSON.stringify(file));
                callback(err, file);
            });
    }

    this.deleteLikes = function(id, userId, callback) {
        "use strict";

        var fileId = new ObjectID(id);

        /* userId will be added if not exists already */
        photos.findAndModify(
            {_id: fileId}, // query
            [['_id','asc']],  // sort order
            { $pull: { likes: userId} , $set: { updatedAt : new Date()}}, 
            {}, // options
            function(err, file) {
                if (err) return callback(err, null);

                console.log("Updated " + JSON.stringify(file));
                callback(err, file);
            });
    }
    this.deleteDislikes = function(id, userId, callback) {
        "use strict";

        var fileId = new ObjectID(id);

        /* userId will be added if not exists already */
        photos.findAndModify(
            {_id: fileId}, // query
            [['_id','asc']],  // sort order
            { $pull: { dislikes: userId} , $set: { updatedAt : new Date()}}, 
            {}, // options
            function(err, file) {
                if (err) return callback(err, null);

                console.log("Updated " + JSON.stringify(file));
                callback(err, file);
            });
    }
    this.getLikesCount = function(id, callback) {
        "use strict";
        var projections = {
            likes : true
        };
        var fileId = new ObjectID(id);
        photos.findOne({_id : fileId}, projections , function(err, file) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found file " + JSON.stringify(file));
            var likesCount = file.likes ? file.likes.length : 0;
            callback(err, likesCount);
        });
    }

    this.getDislikesCount = function(id, callback) {
        "use strict";
        var projections = {
            dislikes : true
        };
        var fileId = new ObjectID(id);
        photos.findOne({_id : fileId}, projections , function(err, file) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found file " + JSON.stringify(file));
            var dislikesCount = file.dislikes ? file.dislikes.length : 0;
            callback(err, dislikesCount);
        });
    }
}

module.exports.PhotosDAO = PhotosDAO;