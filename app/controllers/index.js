/**
 * Created by rolf on 11-2-15.
 */
"use strict";
var fs = require('fs')
    , path = require('path')
    , _ = require('lodash')
    , promise = require('bluebird')
    , walk = require('walk')
    ;

module.exports = {
    init: function () {
        return new promise(function (resolve, reject) {
            var root = __dirname;
            var controllers = {};
            var walker = walk.walk(root);
            walker.on('file', function (directory, file, next) {
                if (file.name !== 'index.js') {
                    file = [directory.replace(root, ''), file.name.replace('.js', '')].join('/').substr(1);
                    var keys = file.split('/');
                    var obj = controllers;
                    _.each(keys, function (key, index) {
                        if (!obj[key]) {
                            obj[key] = {};
                        }
                        if (index === keys.length - 1) {
                            obj[key] = require(path.resolve([root, '/', file, '.js'].join('')));
                        }
                        else {
                            obj = obj[key];
                        }
                    });
                }
                next();
            });

            walker.on('error', function (err) {
                reject(err);
            });

            walker.on('end', function () {
                resolve(controllers);
            });
        });
    }
};
