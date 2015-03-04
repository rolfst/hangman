/**
 * Created by rolf on 12-2-15.
 */
var _ = require('lodash'),
    errorHandler = require('./errors.server.controller.js'),
    Promise = require('bluebird'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    Word = mongoose.model('Word');
Game = mongoose.model('Game');

module.exports.list = function (req, res) {
    console.log("fetching games");
    return new Promise(function (resolve) {
        Game.find({}).sort('-created').populate('word').populate('user displayName').exec(function (err, games) {
            res.json(games);
            resolve(res);
        });
    });
};

module.exports.create = function (req, res) {
    var user = req.user;
    return new Promise(function (resolve) {
        Word.findRandom()
            .limit(1)
            .exec(function (err, words) {
                var game = new Game({word: words[0], user: user});
                game.save(function (err, saved_game) {
                    Game.populate(saved_game, {path: 'word', model: 'Word'})
                        .then(function (populated) {
                            res.status(201).json(saved_game);
                            resolve(res);
                        }).end();
                });
            });
    });
};

module.exports.update = function (req, res, next) {
    return new Promise(function (resolve, reject) {
        var ch = req.body.ch;
        if (ch.length !== 1) {
            res.status(400).send({message: "wrong amount of characters: " + ch.length});
            reject(res);
            return;
        }
        Game.findById(req.params.gameId).populate('word').exec(function (err, foundGame) {
            foundGame.checkLetter(ch);

            foundGame.save(function (err, saved_game) {
                if (err) {
                    //when this happens the game fails and is over
                    var status = res.status(400);
                    if (err.type === 'ValidationError') {
                        status.json(foundGame);
                    } else {
                        status.json({message: errorHandler.getErrorMessage(err)});
                    }
                    reject(err);
                    return;
                }


                Game.populate(saved_game, {path: 'word', model: 'Word'})
                    .then(function (populated) {
                        res.json(populated);
                        resolve([res, populatedd]);
                    });

            });
        });
    });
};

module.exports.findById = function (req, res, next) {
    var id = req.params.gameId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Game is invalid'
        });
    }
    return new Promise(function (resolve) {
        Game.findById(id).exec()
            .then(function (game) {
                if (!game) {
                    var status = res.status(404);
                    return status.send({message: 'game not found.'});
                }
                
                Game.populate(game, {path: 'word', model: 'Word'})
                    .then(function (populated) {
                        res.json(populated);
                        return resolve([res, populated]);
                    });
            }, function (err) {
                return next(err);
            });
    });

};

/**
 * Game authorization middleware
 */
module.exports.hasAuthorization = function (req, res, next) {
    if (req.game.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};
