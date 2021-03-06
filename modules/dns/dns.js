/**
 * Module Name: DNS 
 * Description: Performs and reports on basic DNS functions.
 */
var dnsmod = require('dns'),
    request = require('request');

var dns = function(dbot) {
    var commands = {
        '~lookup': function(event) {
            domain = event.params[1];
            dnsmod.lookup(domain, function (error, addr) {
                if (error) {
                    event.reply(dbot.t("lookup-error",{"domain": domain, "code": error.code}));
                } else {
                    event.reply(dbot.t("lookup",{"domain": domain, "address": addr}));
                }
            });
        },

        '~rdns': function(event) {
            ip = event.params[1];
            dnsmod.reverse(ip, function (error, domain) {
                if (error) {
                    event.reply(dbot.t("rdns-error",{"domain": domain, "ip": ip, "error": error.code}));
                } else {
                    event.reply(dbot.t("rdns",{"domain": domain, "ip": ip}));
                }
            });
        },

        '~geoip': function(event) {
            var ip = event.params[1];
            request.get('http://www.telize.com/geoip/'+ip, {
                'json': true
            }, function(err, response, body) {
                if(!err && body && !_.has(body, 'code')) {
                    event.reply(ip + ' is located in '+ body.postal_code + ', ' + body.city + ', ' + body.country + ' and is hosted by ' + body.isp);
                } else {
                    event.reply('No info about ' + ip);
                }
            });
        }
    };
    this.commands = commands;

    this.on = 'PRIVMSG';
};

exports.fetch = function(dbot) {
    return new dns(dbot);
};
