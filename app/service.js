var mongoose = require('mongoose');
var Move = mongoose.Schema('Move');

module.exports = {

    find: function(params, callback) {
        'use strict';

        //Move.find({}, function(err, moves) {
            //if (err) {
                //callback(err, null);
            //}
            //else {
                //callback(null, moves);
            //}
        //});
    },

    create: function(data, params, callback) {
        'use strict';

        //log('adding', data, params);
        //data.id = this.todos.length;
        //this.moves.push(data);
        //callback(null, data);
    }
};
