var _ = require('underscore');
var primus = new Primus('http://localhost:8000');

primus.on('game created', function (data) {
    console.log('game created?', data);
});
