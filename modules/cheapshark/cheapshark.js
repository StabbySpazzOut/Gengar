/**
 * Module Name: CheapShark
 * Description: Gets cheapsharks.
 * Requires: foo [bar]
 */

var _ = require('underscore')._,
	request = require('request');

var cheapshark = function(dbot) {

	this.ApiRoot = 'http://www.cheapshark.com/api/1.0/';

	this.internalAPI = {
	};

	this.api = {
        'getGameByTitle': function(title, callback) {
            request.get(this.ApiRoot + 'games?title=' + title + '&limit=1', {
                'json': true
            }, function(err, res, body) {
                var game = _.first(body);

                callback(err, game);
            });
        }
	};

	this.commands = {
    	'~cheapshark': function(event) {
            var title = event.input[1];

            this.api.getGameByTitle(title, function (err, game) {
                event.reply('The best deal on ' + game.external
                    + ' is $' + game.cheapest
                    + ' at http://www.cheapshark.com/redirect?dealID='
                    + game.cheapestDealID +' !');
            });
        },
	};

    this.commands['~cheapshark'].regex = [/^cheapshark (.+)/, 2];

    this.onLoad = function() {
    };

    this.onDestroy = function() {
    //stuff to be done on destroy here
    };

};

exports.fetch = function(dbot) {
    return new cheapshark(dbot); //name of module
};
