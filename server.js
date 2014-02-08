var feathers = require('feathers');
var mongoose = require('mongoose');

var log = console.log;

var move_service = {
    moves: [],

    find: function(params, callback) {
        'use strict';
        callback(null, this.moves);
    },

    create: function(data, params, callback) {
        'use strict';

        log('adding', data, params);
        data.id = this.todos.length;
        this.moves.push(data);
        callback(null, data);
    }
};

// Connect to the database
var db = mongoose.connect('mongodb://localhost/chess');

// Loading the models manually :P
require(__dirname + '/app/models');

var app = feathers();

// Serving static files
app.use(feathers.static(__dirname + '/public'));

// Use socket io
app.configure(feathers.primus({ transformer: 'sockjs' }));

// Use the todoService
app.use('/game', move_service);

// Start listening on port
app.listen(8000);

console.log('Server running on 8000');


