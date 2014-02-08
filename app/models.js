// List of mongoose models
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Move Schema
 */
var MoveSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    // Reference to previous move
    previous: {
        type: Schema.Types.ObjectId, ref: 'Move'
    },
    state: {
        type: String,
        required: true
    }
});

/**
 * Move Validations
 */
MoveSchema.path('state').validate(function(state) {
    return state.length === 64;
}, 'State should have 64 elements');

MoveSchema.statics.load = function(id, callback) {
    this.findOne({
        _id: id
    }).exec(cb);
};

mongoose.model('Move', MoveSchema);
