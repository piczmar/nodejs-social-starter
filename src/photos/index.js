import PhotosController from './controller';

module.exports = exports = function(server, db) {

    var contentHandler = new PhotosController(db);
    
    /* upload photo */
    server.post('/api/photos', contentHandler.upload);
    /* list all photos */
    server.get('/api/photos', contentHandler.getAllMeta);
    /* get this photo download URL */
    server.get('/api/photos/:id', contentHandler.get);
    /* removes this photo */
    server.del('/api/photos/:id', contentHandler.remove);
    /* get this photo details */
    server.get('/api/photos/:id/meta', contentHandler.getMeta);
    /* update this photo details */
    server.put('/api/photos/:id/meta', contentHandler.updateMeta);
    /* get comments to this photo */
    server.get('/api/photos/:id/comments', contentHandler.getComments);
    /* get count of users who like this photo */
    server.get('/api/photos/:id/likes', contentHandler.getLikesCount);
    /* get count of users who do not like this photo */
    server.get('/api/photos/:id/dislikes', contentHandler.getDislikesCount);
     /* Like photo (:photoId) by this user (:userId) */
    server.post('/api/photos/:id/likes/:userId', contentHandler.addLike);
    /* Remove like for photo (:photoId) by this user (:userId) */
	server.del('/api/photos/:id/likes/:userId', contentHandler.deleteLike);
    /* Dislike photo (:photoId) by this user (:userId) */
    server.post('/api/photos/:id/dislikes/:userId', contentHandler.addDislike);
    /* Remove dislike for photo (:photoId) by this user (:userId) */
	server.del('/api/photos/:id/dislikes/:userId', contentHandler.deleteDislike);


}