'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash')
    , Schema = mongoose.Schema
    , Promise = require('bluebird')
    , Word = require('./word')
    ;

/**
 * Game Schema
 */
var GameSchema = new Schema({

    status: {
        type: String,
        enum: ['busy', 'failed', 'success']
        , default: 'busy'
    },
    tries_left: {
        type: Number,
        default: 10
    }
    , characters: {type: [String], default: []}
    , user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    , word: {
        type: Schema.Types.ObjectId,
        ref: 'Word'
    }

}, {
    toJSON: {
        virtuals: true

    }
});
GameSchema.virtual('gameId').get(function () {
    return this._id;
});
GameSchema.virtual('shadowword').get(function () {
    return this.buildWord();

});
GameSchema.methods.checkLetter = function (letter) {
    this.characters.push(letter);
    var wordToGuess = this.word.content
        , wordLength = wordToGuess.length
        , wrongGuess = true
        ;

    // split the placeholders into an array
    // loop through the array
    for (var i = 0; i < wordLength; i++) {
        // if the selected letter matches one in the word to guess,
        // replace the underscore and increase the number of correct guesses
        if (wordToGuess.charAt(i) == letter.toLowerCase()) {
            wrongGuess = false;
        }
    }
    // if the guess was incorrect, decrease the number of tries
    if (wrongGuess) {
        this.tries_left--;
        if (this.tries_left === 0) this.status = 'failure';
    }
    return !wrongGuess;
};

GameSchema.methods.toJSON = function () {
    var obj = this.toObject();
    obj.shadowword = this.buildWord();
    obj.word = null;
    return obj;
};

GameSchema.methods.buildWord = function () {
    if (this.status !== 'success') {
        var wordToGuess = this.word.content
            , self = this
            , wordLength = wordToGuess.length
            , correctGuesses = 0
            , placeholders = _.map(wordToGuess.split(""), function (letter) {
                //we are going to return '_' for each letter
                return '_'
            });
        
        // split the placeholders into an array
        // loop through the array
        _.forEach(self.characters, function (letter) {
            for (var i = 0; i < wordLength; i++) {
                // if the selected letter matches one in the word to guess,
                // replace the underscore and increase the number of correct guesses
                if (wordToGuess.charAt(i) == letter.toLowerCase()) {
                    placeholders[i] = letter;
                    correctGuesses++;
                    // set status only if all letters have been guessed
                    if (correctGuesses === wordLength)
                        self.status = 'success';
                }
            }
        });
        // convert the array to a string and display it again
        return placeholders.join('');
    }
    // just be fast with success no need to recalculate the shadow word again
    if (this.status === 'success'){
        return this.word.content;
    }
};


mongoose.model('Game', GameSchema);
