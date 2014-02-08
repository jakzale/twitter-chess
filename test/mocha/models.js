/* Module dependencies
 *
 */

var should = require('should');
var mongoose = require('mongoose');
var Move = mongoose.model('Move');

var move;
describe('<Unit Test>', function(){
    'use strict';

    describe('Model Move:', function() {
        before(function(done) {
            move = new Move({
                state: '        ' +
                    '        ' +
                    '        ' +
                    '        ' +
                    '        ' +
                    '        ' +
                    '        ' +
                    '        '
            });

            done();
        });

        describe('Method Save', function() {
            it('should begin with no moves', function(done) {
                Move.find({}, function(err, moves) {
                    moves.should.have.length(0);
                    done();
                });
            });

            it('should be able to save without problems', function(done) {
                move.save(function (err) {
                    should.not.exists(err);
                    done();
                });
            });
        });
        after(function(done) {
            Move.remove().exec();
            done();
        });
    });
});

