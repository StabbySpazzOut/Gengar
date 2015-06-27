/**
 * Module Name: Dongers
 * Description: Gets dongers.
 * Requires: foo [bar]
 */

var _ = require('underscore')._,
	request = require('request');

var dongers = function(dbot) {

	this.ApiRoot = 'https://www.kimonolabs.com/api/';

	this.internalAPI = {
	};

	this.api = {
        'getRandomDongerByCategory': function(category, callback) {
            request.get(this.ApiRoot + 'ondemand/cp2pfkco?apikey='
                + this.config.api_key + '&kimpath2=' + category, {
                'json': true
            }, function(err, res, body) {
                var dongers = body.results.dongers;

                var donger = _.sample(dongers).donger;

                callback(err, donger);
            });
        },

        'getCategories': function(callback) {
            request.get(this.ApiRoot + 'bh28lyqg?apikey=' + this.config.api_key, {
                'json': true
            }, function(err, res, body) {
                var categories = _.pluck(body.results.categories, 'text');

                callback(err, categories);
            });
        }
	};

	this.commands = {
    	'~donger': function(event) {
            var category = event.input[1];

            this.api.getRandomDongerByCategory(category, function (err, donger) {
                if (donger) {
                    event.reply(donger);
                } else {
                    this.api.getCategories(function(categories) {
                        event.reply(dbot.t('no_donger', {
                            'categories': categories.join(', ')
                        }));
                    });
                }
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
