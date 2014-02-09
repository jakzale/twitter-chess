var chess   = require('../../client/chess');
var libs    = require('../../client/libs');
var should  = require('should');
var _ = require('underscore');

describe('Chess tests', function() {
    'use strict';

    var start_board = [
        ['wr', 'wp', '', '', '', '', 'bp', 'br'],
        ['wn', 'wp', '', '', '', '', 'bp', 'bn'],
        ['wb', 'wp', '', '', '', '', 'bp', 'bb'],
        ['wq', 'wp', '', '', '', '', 'bp', 'bq'],
        ['wk', 'wp', '', '', '', '', 'bp', 'bk'],
        ['wb', 'wp', '', '', '', '', 'bp', 'bb'],
        ['wn', 'wp', '', '', '', '', 'bp', 'bn'],
        ['wr', 'wp', '', '', '', '', 'bp', 'br']
    ];

    describe('Valid moves tests', function() {
        it('should work for an empty start position', function() {
            var moves = chess.get_valid_moves(start_board, 3, 3);
            moves.moves.should.have.length(0);
            moves.attacks.should.have.length(0);
        });

        it('should work for pawns', function() {
            _.each([1, 6], function(y) {
                _.each(_.range(8), function(x) {
                    var moves = chess.get_valid_moves(start_board, x, y);
                    if (y === 1) {
                        moves.moves.should.eql([[x, 2], [x, 3]]);
                    } else {
                        moves.moves.should.eql([[x, 5], [x, 4]]);
                    }

                    moves.attacks.should.have.length(0);
                });
            });
        });

        it('should work for for the back figures', function() {
            _.each([0, 7], function(y) {
                _.each(_.range(8), function(x) {
                    if (x == 1 || x == 6) return;

                    var moves = chess.get_valid_moves(start_board, x, y);
                    moves.moves.should.have.length(0);
                });
            });
        });

        it('should provide protections', function() {
            var moves = chess.get_valid_moves(start_board, 0, 0);

            moves.protections.contains([0, 1]).should.be.ok;
            moves.protections.contains([1, 0]).should.be.ok;
        });
    });
});
