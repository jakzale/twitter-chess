var _ = require('underscore');
var tree = require('./chess');

var primus = new Primus('http://localhost:8000');

primus.on('open', function (data) {
    console.log('game created?', data);
});
