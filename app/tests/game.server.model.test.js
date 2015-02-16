'use strict';

/**
 * Module dependencies.
 */
var chai = require('chai'),
    expect = chai.expect,
	mongoose = require('mongoose'),
	Word = mongoose.model('Word'),
	Game = mongoose.model('Game');

/**
 * Globals
 */
var word, game;

/**
 * Unit tests
 */
describe('Game Model Unit Tests:', function() {
	before(function(done) {
		word = new Word({
            content: 'username'
		});

		word.save(function() {
			game = new Game({
				word: word
			});
			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return game.save(function(err) {
				expect(err).to.not.exist;
				done();
			});
		});

		it('should be able to show an error when try to save with wrong status', function(done) {
			game.status = '';
			return game.save(function(err) {
				expect(err).to.exist;
				done();
			});
		});

        it('Should not accept multiple characters', function(done){
            game = new Game({word: word, characters: 'da'});
            game.save(function(err, game){
                expect(err).to.be.null;
                done();
            });
        });
        
        it('should contain a word object', function(done){
            game.save(function(err, saved_game){
                expect(saved_game.word).to.exist;
                done();
            });
        });
    });

    describe('listing', function(){
        it('Should list all Current games', function(done){
            console.log('init game: ' + game);
            game.save(function(err, game){
                Game.count({}, function(err, c){
                    expect(c, 'number of games').to.be.equal(2);
                    done();
                });
            });
        });
        
        it('should list one', function(done){
            Game.findOne({tries_left: 10}).populate('word').exec()
            .then(function (games) {
                expect(games.word.content, 'word content').to.be.equal('username');
                done();
            });
        });
        
        it('should list one', function(done){
            Game.find({}).populate('word').exec()
            .then(function (games) {
                expect(games[0].word.content).to.be.equal('username');
                done();
            });
        });
    });

    describe('logic', function() {
        it('should check letters in word', function (done) {
            Game.findOne({tries_left: 10}).populate('word').exec(function (err, foundGame) {
                var found = foundGame.checkLetter('e');
                expect(found).to.be.true;
                found = foundGame.checkLetter('l');
                expect(found).to.be.false;

                done();
            });
        });

        it('should return all two letters', function(done){
            Game.findOne({tries_left:10}).populate('word').exec(function(err, foundGame){
                foundGame.characters.push('l');
                var found = foundGame.buildWord();
                expect(found).to.be.equal('________');
                foundGame.characters.push('e');
                found = foundGame.buildWord();
                expect(found).to.be.equal('__e____e');
                foundGame.characters.push('u');
                found = foundGame.buildWord();
                expect(found).to.be.equal('u_e____e');
                foundGame.characters.push('s');
                found = foundGame.buildWord();
                expect(found).to.be.equal('use____e');
                foundGame.characters.push('r');
                found = foundGame.buildWord();
                expect(found).to.be.equal('user___e');
                foundGame.characters.push('n');
                found = foundGame.buildWord();
                expect(found).to.be.equal('usern__e');
                foundGame.characters.push('a');
                found = foundGame.buildWord();
                expect(found).to.be.equal('userna_e');
                foundGame.characters.push('m');
                found = foundGame.buildWord();
                expect(found).to.be.equal('username');

                done();
            });
        });
    });

	after(function(done) {
		Game.remove().exec();
		Word.remove().exec();
		done();
	});
});
