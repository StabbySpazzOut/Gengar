/**
 * Module Name: youtube
 * Description: Various Youtube functionality
 */
var _ = require('underscore')._,
    request = require('request');

var youtube = function(dbot) {
    this.ApiRoot = 'https://gdata.youtube.com/feeds/api';
    this.params = {
        'alt': 'json',
        'v': 2
    };
    this.LinkRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

    this.commands = {
        '~youtube': function(event) {
            request.get(this.ApiRoot + '/videos', {
                'qs': _.extend(this.params, { 
                    'q': event.input[1],
                    'max-results': 1
                }),
                'json': true
            }, function(error, response, body) {
                if(_.isObject(body) && _.has(body, 'feed') && _.has(body.feed, 'entry')) {
                    var v = body.feed.entry[0];
                    if(!_.has(v, 'yt$rating')) {
                        v['yt$rating'] = {
                            'numLikes': 0,
                            'numDislikes': 0
                        };
                    }
                    if(!_.has(v, 'yt$statistics')) {
                        v['yt$statistics'] = { 'viewCount': 0 };
                    }

                    var link = v.link[0].href.match(this.LinkRegex)[2];
                    event.reply(dbot.t('yt_video', {
                        'title': v.title['$t'],
                        'plays': v['yt$statistics'].viewCount,
                        'author': v.author[0].name['$t'],
                        'likes': v['yt$rating'].numLikes,
                        'dislikes': v['yt$rating'].numDislikes
                    }) + ' - ' + 'http://youtu.be/' + link);
                } else {
                    event.reply(dbot.t('yt_noresults'));
                }
            }.bind(this));
        }
    };
    this.commands['~youtube'].regex = [/^~youtube (.+)$/, 2];

    this.onLoad = function() {
        dbot.api.link.addHandler(this.name, this.LinkRegex,
            function(event, match, name) {
                request.get(this.ApiRoot + '/videos/' + match[2], {
                    'qs': this.params,
                    'json': true
                }, function(error, response, body) {
                    if(_.isObject(body) && _.has(body, 'entry')) {
                        var v = body.entry;
                        if(!_.has(v, 'yt$rating')) {
                            v['yt$rating'] = {
                                'numLikes': 0,
                                'numDislikes': 0
                            };
                        }
                        event.reply(dbot.t('yt_video', {
                            'title': v.title['$t'],
                            'plays': v['yt$statistics'].viewCount,
                            'author': v.author[0].name['$t'],
                            'likes': v['yt$rating'].numLikes,
                            'dislikes': v['yt$rating'].numDislikes
                        }));
                    }
                });
            }.bind(this));
    }.bind(this);
};

exports.fetch = function(dbot) {
    return new youtube(dbot);
};
