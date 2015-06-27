/**
 * Module Name: Dongers
 * Description: Gets dongers.
 * Requires: foo [bar]
 */

var _ = require('underscore')._,
	request = require('request'),
    categories = [];

var dongers = function(dbot) {

	this.ApiRoot = 'https://www.kimonolabs.com/api/';

	this.internalAPI = {
	};

    this.getCategories = function(callback) {
        request.get(this.ApiRoot + 'bh28lyqg?apikey=' + this.config.api_key, {
            'json': true
        }, function(err, res, body) {
            var categories = _.pluck(body.results.categories, 'text');

            callback(err, categories);
        });
    };

	this.api = {
        'getRandomDongerByCategory': function(category, callback) {
            request.get(this.ApiRoot + 'ondemand/cp2pfkco?apikey='
                + this.config.api_key + '&kimpath2=' + category, {
                'json': true
            }, function(err, res, body) {
                if (_.has(body.results, 'dongers')) {
                    var dongers = body.results.dongers;

                    var donger = _.sample(dongers).donger;
                } else {
                    var donger = null;
                }

                callback(err, donger);
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
                    event.reply(dbot.t('no_donger', {
                        'categories': categories.join(', ')
                    }));
                }
            });
        },
	};

    this.commands['~donger'].regex = [/^donger ([a-zA-Z-]+)/, 2];

    this.onLoad = function() {
        this.getCategories(function(err, categories) {
            categories = categories;
        })
    };

    this.onDestroy = function() {
    //stuff to be done on destroy here
    };

};

exports.fetch = function(dbot) {
    return new dongers(dbot); //name of module
};
