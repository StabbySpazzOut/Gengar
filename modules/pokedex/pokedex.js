/**
 * Module Name: Pokedex
 * Description: Gets information about pokemon.
 * Requires: foo [bar]
 */

var _ = require('underscore')._,
	request = require('request'),
    Fuzzy = require('fuzzyset.js'),
    pokeDict = [],
    pokeFuzzy = {};

var pokedex = function(dbot) {

	this.ApiRoot = 'http://pokeapi.co/api/v1/';

    this.getAllPokemon = function(callback) {
        request.get(this.ApiRoot + 'pokedex/1', {
            'json': true
        }, function(err, res, body) {
            var pokemon = [];

            _.each(body.pokemon, function(item){
                pokemon[item.name] = item.resource_uri.split('/')[3];
            });

            callback(err, pokemon);
        });
    };

    this.getPokemonByName = function(name, callback) {
        var dexName = pokeFuzzy.get(name)[0][1],
            dexNumber = pokeDict[dexName];

        this.api.getPokemon(dexNumber, function(err, data) {
            callback(err, data);
        });
    }

	this.internalAPI = {
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
            var name = event.input[1];

            this.getPokemonByName(name, function(err, data) {
                var types = [];
                _.each(data.types, function(item) { types.push(item.name.capitalize()) });

                var evolutions = "I don't evolve into anything!";

                if(data.evolutions.length > 0) {
                    var evos = [];
                    _.each(data.evolutions, function(item) {
                        evos.push(item.to.capitalize()
                            + " via " + (item.method == 'other' ? item.detail : item.method)
                            + (item.level ? ' at level ' + item.level : ''));
                    });
                    evolutions = "I evolve into " + evos.join(' and ');
                    evolutions = evolutions.replace('_', ' ');
                }

                event.reply(dbot.t('pokemon_data', {
                    'name': data.name,
                    'types': types.join(' and '),
                    'evolutions': evolutions
                }));
            });
        },
	};

    this.commands['~dex'].regex = [/^dex ([a-zA-Z-]+)/, 2];

    this.onLoad = function() {
        this.getAllPokemon(function(err, data) {
            pokeDict = data;
            pokeFuzzy = new Fuzzy(_.keys(pokeDict));
        });
    };

    this.onDestroy = function() {
    //stuff to be done on destroy here
    };

    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

};

exports.fetch = function(dbot) {
    return new pokedex(dbot); //name of module
};
