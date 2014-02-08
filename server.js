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

var app = feathers();

// Serving static files
app.use(feathers.static(__dirname + '/public'));

// Use socket io
app.configure(feathers.socketio());

// Use the todoService
app.use('/todo', todoService);

// Start listening on port
app.listen(8000);

console.log('Server running on 8000');


