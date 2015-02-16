'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
    , random = require('mongoose-random')
    , Schema = mongoose.Schema;

/**
 * Word Schema
 */
var WordSchema = new Schema({
    content: {
        type: String,
        default: '',
        trim: true
    }
});
WordSchema.plugin(random, {path: 'r'});

module.exports = mongoose.model('Word', WordSchema);
