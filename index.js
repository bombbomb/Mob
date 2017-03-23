
var express = require('express');
var app = express();
var Moniker = require('moniker');
var request = require('request');


var numUsers = process.env.USER_COUNT || 20;
var actionsPerMinute = process.env.APM || 5;

var latitudeOrigin = parseFloat(process.env.LAT) || 38.8;
var longitudeOrigin = parseFloat(process.env.LONG) || -104.8;
var geoMaxThrow =  process.env.THROW || 10;

var endpoint =  process.env.ENDPOINT || 'hydra.bbhydra.com';
var listenPort = parseInt(process.env.PORT) || 3001;

console.log("Num Users: " + numUsers);
console.log("APM: " + actionsPerMinute);

console.log("Welcome Users: ");
var users = [];
for (var i=0;i<numUsers;i++) {
    var fudgeVarianceMs = 2000;
    var fudgeFactor = (((fudgeVarianceMs*2)*Math.random()) - fudgeVarianceMs);
    var apmToMs = (1000 * 60) / actionsPerMinute;
    var userInterval = Math.round(Math.abs(apmToMs + fudgeFactor));
    var user = {
        name: Moniker.choose(),
        lat: latitudeOrigin + (((geoMaxThrow*2)*Math.random())-geoMaxThrow),
        long: longitudeOrigin + (((geoMaxThrow*2)*Math.random())-geoMaxThrow),
        lastPing: 0,
        personalLag: Math.random()*200,
        clickDelay: userInterval,
        region: 'east-1'
    };
    users[i] = user;
    console.log(user);
    setInterval(function(userIndex){
        var user = users[userIndex];
        var myTimerStart = Date.now();
        request(
            {
                url: 'http://' + endpoint + '/load',
                method: 'post',
                json: true,
                body: user
            }
            , function (error, response, body) {
                users[userIndex].lastPing = Date.now() - myTimerStart;
            }
        );
    }, user.clickDelay, i)
}


app.get('/', function (req, res) {
    res.send({
        'region': process.env.REGION,
        'users': users
    })
});

app.listen(listenPort, function () {
    console.log('It\'s the mob!')
});