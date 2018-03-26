var CommentsController = require('./controller');

module.exports = exports = function(server, db) {

    var contentHandler = new CommentsController(db);
    
    /* add new comment */
    server.post('/api/comments', contentHandler.add);
    /* list all comments */
    server.get('/api/comments', contentHandler.getAll);
    /* get this comment */
    server.get('/api/comments/:id', contentHandler.get);
    /* update this comment */
    server.put('/api/comments/:id', contentHandler.update);
    /* remove this comment*/
	server.del('/api/comments/:id', contentHandler.remove);


}