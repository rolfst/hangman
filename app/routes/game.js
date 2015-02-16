/**
 * Created by rolf on 12-2-15.
 */
module.exports = function(app, controllers) {
    var games = controllers.game;
    var users = controllers['users.server.controller'];
    app.route('/games')
        .get(games.list)
        .post(users.requiresLogin, games.create)
    ;
    app.route('/games/:gameId')
        .get(users.requiresLogin, games.findById)
        .post(users.requiresLogin, games.update)
    ;

};
