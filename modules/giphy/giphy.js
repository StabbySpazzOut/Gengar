/**
 * Module Name: Giphy
 * Description: Gets giphys.
 * Requires: foo [bar]
 */

var _ = require('underscore')._,
	request = require('request');

var giphy = function(dbot) {

	this.ApiRoot = 'http://api.giphy.com/v1/gifs/translate?api_key=dc6zaTOxFJmzC';

	this.internalAPI = {
	};

	this.api = {
        'getGiphyFromString': function(string, callback) {
            request.get(this.ApiRoot + '&s=' + string, {
                'json': true
            }, function(err, res, body) {
                var giphy = body.data.bitly_url;

                callback(err, giphy);
            });
        }
	};

	this.commands = {
    	'~giphy': function(event) {
            var string = event.input[1];

            this.api.getGiphyFromString(string, function (err, giphy) {
                event.reply(giphy);
            });
        },
	};

    this.commands['~giphy'].regex = [/^giphy (.+)/, 2];

    this.onLoad = function() {
    };

    this.onDestroy = function() {
    //stuff to be done on destroy here
    };

};

exports.fetch = function(dbot) {
    return new giphy(dbot); //name of module
};
