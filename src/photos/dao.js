import fs from 'fs';
import { ObjectID, GridStore, GridFSBucket} from 'mongodb';

"use strict";

/**
 * PhotosDAO class.
 * 
 * @constructor
 * @param {String} db - database
 */
export class PhotosDAO{

    constructor(db){
        this.db = db;
        this.photos = db.collection("fs.files");
    }

    upload (pathOnDisk, metaData, callback) {
        console.log("inserting photo from file path" + pathOnDisk );

        const fileId = new ObjectID();
        const fileName = "f"+fileId;
        const bucket = new GridFSBucket(this.db);

        fs.createReadStream(pathOnDisk).
            pipe(bucket.openUploadStreamWithId(fileId, fileName, {metadata : metaData})).
            on('error', (error) => callback(error, null)).
            on('finish', () => {
                    // clean local disk
                    fs.unlink(pathOnDisk, function(error){
                        if(error)
                            console.log("Cannot remove file: " + pathOnDisk);
                        console.log ("Cleanup file (OK) " + pathOnDisk);

                        if (error)
                            return callback(error, null);

                        callback(error,fileId);

                    });
            });
    }

    get(id, callback) {
        const fileId = new ObjectID(id);

        GridStore.read(this.db, fileId, (err, fileData) => callback(err, fileData));
    }

    remove(id, callback){
        const fileId = new ObjectID(id);
        const gridStore = new GridStore(this.db, fileId, "r");

        gridStore.open((err, gridStore) => {
            if (err) return callback(err, null);
            // Unlink the file
            gridStore.unlink(function(err, result) {
                if (err) return callback(err, null);

                callback(err, result);
            });
        });
    }

    getAllMetadata(criteria, skip, limit, sortSpec, callback){
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
        
        this.photos.find(criteria, projections).sort(sort).skip(skip).limit(limit).toArray(function(err, files) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found " + files.length + " files");
            callback(err, files);
        });

    }

    getMetadata(id, callback) {
        "use strict";
        var projections = {
            chunkSize : false,
            md5 : false,
            contentType : false, 
            aliases : false
        };
        var fileId = new ObjectID(id);
        this.photos.findOne({_id : fileId}, projections , function(err, file) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found file " + JSON.stringify(file));
            callback(err, file);
        });

    }

    updateMetadata(id, meta, callback) {
        "use strict";
        var fileId = new ObjectID(id);
        this.photos.update({_id : fileId}, meta , function(err, numberOfUpdatedDocs) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Updated metadata " + numberOfUpdatedDocs);
            callback(err, numberOfUpdatedDocs);
        });

    }

    addLikes(id, userId, callback){
        "use strict";

        var fileId = new ObjectID(id);

        /* userId will be added if not exists already */
        this.photos.findOneAndUpdate(
            {_id: fileId}, // query
            { $addToSet: { likes: userId} , $pull: { dislikes: userId} , $set: { updatedAt : new Date()}},
            {}, // options
            function(err, file) {
                if (err) return callback(err, null);

                console.log("Updated " + JSON.stringify(file));
                callback(err, file);
            });
    }
    
    addDislikes(id, userId, callback){
        "use strict";

        var fileId = new ObjectID(id);

        /* userId will be added if not exists already */
        this.photos.findAndModify(
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

    deleteLikes(id, userId, callback){
        "use strict";

        var fileId = new ObjectID(id);

        /* userId will be added if not exists already */
        this.photos.findAndModify(
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
    deleteDislikes(id, userId, callback){
        "use strict";

        var fileId = new ObjectID(id);

        /* userId will be added if not exists already */
        this.photos.findAndModify(
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
    
    getLikesCount(id, callback){
        "use strict";
        var projections = {
            likes : true
        };
        var fileId = new ObjectID(id);
        this.photos.findOne({_id : fileId}, projections , function(err, file) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found file " + JSON.stringify(file));
            var likesCount = file.likes ? file.likes.length : 0;
            callback(err, likesCount);
        });
    }

    getDislikesCount(id, callback){
        "use strict";
        var projections = {
            dislikes : true
        };
        var fileId = new ObjectID(id);
        this.photos.findOne({_id : fileId}, projections , function(err, file) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found file " + JSON.stringify(file));
            var dislikesCount = file.dislikes ? file.dislikes.length : 0;
            callback(err, dislikesCount);
        });
    }
}