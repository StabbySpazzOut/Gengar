/**
 * Module Name: Pokedex
 * Description: Gets information about pokemon.
 * Requires: foo [bar]
 */

var _ = require('underscore')._,
	request = require('request');

var pokedex = function(dbot) {

	this.ApiRoot = 'http://pokeapi.co/api/v1/';

	this.internalAPI = {
    //code for internal api here
	};

	this.api = {
        'getPokemon': function(id, callback) {
            request.get(this.ApiRoot + 'pokemon/' + id, {
                'json': true
            }, function(err, res, body) {
                callback(err, body);
            });
        }
	};

	this.commands = {
    	'~dex': function(event) {
            var pokemon = event.input[1];

            this.api.getPokemon(pokemon, function(err, data){
                event.reply(data.name);
            });
        },
	};

    this.commands['~dex'].regex = [/^dex (\d+)/, 2];

	this.onLoad = function() {
    //code for stuff to be done on load here
    };

    this.onDestroy = function() {
    //stuff to be done on destroy here
    };

};

exports.fetch = function(dbot) {
    return new pokedex(dbot); //name of module
};
