/**
 * Created by rolf on 12-2-15.
 */
"use strict";
var chai = require('chai')
    , expect = chai.expect
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , controller = require('../controllers/game')
    , mongoose = require('mongoose')
    , Word = mongoose.model('Word')
    , Game = mongoose.model('Game')
    ;
chai.use(require('chai-as-promised'));
chai.use(sinonChai);
var word, game;
describe('Games', function(){
    before(function(done){
        word = new Word({content: "testing"});

        word.save(function(){
            game = new Game({
                word: word
            });
          //  game.save(function(err, game){
                done();
           // });
        });
    });
    it('testing get all games', function(done){
        var req, res, spy;
        req = res = {};
        game.save(function(){
            spy = res.json = sinon.spy();
            controller.list(req, res).then(function(res) {
                expect(res.json).to.have.been.calledOnce;
                done();
            });
        });
    });

    it('creation of a new game', function(done){
        var req, res;
        req = {};
        res = {
            json_value: {}
            , status_value: ''
            , message_value: ''
            ,json: function(value){
                this.json_value=value;}
            , status: function(code){
                this.status_value=code;
                return this;
            }
            , send: function(message){
                this.message_value = message;
            }
        };
        controller.create(req, res)
        .then(function(res) {
            expect(res.json_value).to.be.not.empty;
            expect(res.status_value).to.be.equal(201);
            done();
        });
    });
    it('creation of an erroneous new game', function(done){
        var req, res;
        req = {body: {ch:'23'}};
        res = {
            json_value: null
            , status_value: ''
            , message_value: ''
            ,json: function(value){
                this.json_value=value;}
            , status: function(code){
                this.status_value=code;
                return this;
            }
            , send: function(message){
                this.message_value = message;
            }
        };
        controller.update(req, res, null, game.id)
        .then(function(res) {
                //do noting;
            },function(res) {
                expect(res.json_value).to.be.null;
                expect(res.status_value).to.be.equal(400);
                done();
            });
    });

    it('should be failure after 10 false tries', function(done){
        var req, res;
        req={body:{ch: 'l'}};
        function verifyControllerActions(arr, attempts, status){
            expect(arr[1].tries_left).to.be.equal(attempts);
            expect(arr[1].status).to.be.equal(status);
        }
        game = new Game({word: word});
        game.save(function(err, saved){

            res = {json_value: {}
                , status_value: ''
                , message_value: ''
                ,json: function(value){
                    this.json_value=value;}
                , status: function(code){
                        this.status_value=code;
                        return this;
                    }
                };
            controller.update(req, res, null, saved.gameId)
            .then(function(arr){
                verifyControllerActions(arr, 9, 'busy');
                req.body.ch='k';
                return controller.update(req, res, null, saved.gameId);
            })
            .then(function(arr){
                verifyControllerActions(arr, 8, 'busy');
                req.body.ch='p';
                return controller.update(req, res, null, saved.gameId);
            }, function(err){
                    console.log(err);

                })
            .then(function(arr){
                verifyControllerActions(arr, 7, 'busy');
                req.body.ch='x';
                return controller.update(req, res, null, saved.gameId);
            })
            .then(function(arr){
                verifyControllerActions(arr, 6, 'busy');
                req.body.ch='q';
                return controller.update(req, res, null, saved.gameId);
            })
            .then(function(arr){
                verifyControllerActions(arr, 5, 'busy');
                req.body.ch='w';
                return controller.update(req, res, null, saved.gameId);
            })
            .then(function(arr){
                verifyControllerActions(arr, 4, 'busy');
                req.body.ch='o';
                return controller.update(req, res, null, saved.gameId);
            })
            .then(function(arr){
                verifyControllerActions(arr, 3, 'busy');
                req.body.ch='y';
                return controller.update(req, res, null, saved.gameId);
            })
            .then(function(arr){
                verifyControllerActions(arr, 2, 'busy');
                req.body.ch='v';
                return controller.update(req, res, null, saved.gameId);
            })
            .then(function(arr){
                verifyControllerActions(arr, 1, 'busy');
                req.body.ch='z';
                return controller.update(req, res, null, saved.gameId);
            })
            .then(function(arr){
                verifyControllerActions(arr, 0, 'failure');
                expect(arr[0].status_value).to.be.equal(400);
                done();
            }, function(err){
                   console.log(err) ;
                    done();
                });
            
        });
    });

    after(function(done){
        Game.remove().exec();
        Word.remove().exec();
        done();
    })
});
