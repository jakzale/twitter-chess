var feathers = require('feathers');
var http = require('http');

var move_service = {
    find: function(params, callback) {
        callback(null, "heyo");
    },

    create: function(data, params, callback) {
        console.log('adding', data);
        callback(null, data);
    }
};

feathers()
    .configure(feathers.socketio())
    .use('/move', move_service)
    .listen(8000);

console.log('Server running on 8000');


