/**
 * Module Name: Dongers
 * Description: Gets dongers.
 * Requires: foo [bar]
 */

var _ = require('underscore')._,
	request = require('request');

var dongers = function(dbot) {

	this.ApiRoot = 'https://www.kimonolabs.com/api/ondemand/cp2pfkco?apikey=Vx9YkKGUh98WleIBdKfhQI5st0oqhEid';

    this.getRandomDongerByCategory = function(category, callback) {
        request.get(this.ApiRoot + '&kimpath2=' + category, {
            'json': true
        }, function(err, res, body) {
            var dongers = body.results.dongers;

            var donger = _.sample(dongers).donger;

            callback(err, donger);
        });
    };


	this.internalAPI = {
	};

	this.api = {
        'getRandomDongerByCategory': function(category, callback) {
            request.get(this.ApiRoot + '&kimpath2=' + category, {
                'json': true
            }, function(err, res, body) {
                var dongers = body.results.dongers;

                var donger = _.sample(dongers).donger;

                callback(err, donger);
            });
        }
	};

	this.commands = {
    	'~donger': function(event) {
            var category = event.input[1];

            this.api.getRandomDongerByCategory(category, function (err, donger) {
                event.reply(donger);
            });
        },
	};

    this.commands['~donger'].regex = [/^donger ([a-zA-Z-]+)/, 2];

    this.onLoad = function() {
    };

    this.onDestroy = function() {
    //stuff to be done on destroy here
    };

};

exports.fetch = function(dbot) {
    return new dongers(dbot); //name of module
};
