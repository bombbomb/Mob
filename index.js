
var express = require('express');
var app = express();
var Moniker = require('moniker');


var numUsers = process.env.USER_COUNT || 10;
var actionsPerMinute = process.env.APM || 10;

var latitudeOrigin = process.env.LAT || 38.8;
var longitudeOrigin = process.env.LONG || -104.8;
var geoMaxThrow =  process.env.THROW || 5;

var endpoint =  process.env.ENDPOINT || 'https://google.com';
var listenPort = parseInt(process.env.PORT) || 3000;

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
        clickDelay: userInterval
    };
    users[i] = user;
    console.log(user);
    setInterval(function(userIndex){
        var user = users[userIndex];
        console.log("Click from " + user.name);
    }, user.clickDelay, i)
}


app.get('/', function (req, res) {
    res.send(users)
});

app.listen(listenPort, function () {
    console.log('It\'s the mob!')
});