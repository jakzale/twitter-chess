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

feathers()
    .configure(feathers.socketio())
    .use('/todo', todoService)
    .listen(8000);

console.log('Server running on 8000');
