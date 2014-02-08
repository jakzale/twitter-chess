var feathers = require('feathers');

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
app.configure(feathers.primus({ transformer: 'sockjs' }));

// Use the todoService
app.use('/game', move_service);

// Start listening on port
app.listen(8000);

console.log('Server running on 8000');


