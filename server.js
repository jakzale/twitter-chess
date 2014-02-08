var feathers = require('feathers');

var todoService = {
    get: function(name, params, callback) {
        'use strict';

        callback(null, {
            id: name,
            description: "You have to do " + name + "!"
        });
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
