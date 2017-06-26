var UsersController = require('./controller');

module.exports = exports = function(server, db) {

    var contentHandler = new UsersController(db);

    // server.get('/api/users', contentHandler.getAll);
    // server.get('/api/users/:id', contentHandler.get);

    /* get photos for this user */
    server.get('/api/users/:userId/photos', contentHandler.getPhotos);

}