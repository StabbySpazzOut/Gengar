/**
 * Module Name: Pugme
 * Description: Gets a random image of a pug!
 * Requires: foo [bar]
 */

var _ = require('underscore')._,
	request = require('request');

var pugme = function(dbot) {

	this.ApiRoot = 'http://pugme.herokuapp.com/';

	this.internalAPI = {
	};

	this.api = {
        'getRandomPug': function(callback) {
            request.get(this.ApiRoot + 'random', {
                'json': true
            }, function(err, res, body) {
                callback(err, body.pug);
            });
        }
	};

	this.commands = {
    	'~pugme': function(event) {
            this.api.getRandomPug(function(err, pug) {
                event.reply(pug);
            });
        }
	};

    this.commands['~pugme'].regex = [/^pugme/, 1];

    this.onLoad = function() {
    };

    this.onDestroy = function() {
    //stuff to be done on destroy here
    };

};

exports.fetch = function(dbot) {
    return new pugme(dbot); //name of module
};
