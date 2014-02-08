var chess   = require('../../client/chess');
var should  = require('should');
var _ = require('underscore');

describe('Chess tests', function() {
    'use strict';

    var start_board = [
        ['wr', 'wp', '', '', '', '', 'bp', 'br'],
        ['wk', 'wp', '', '', '', '', 'bp', 'bk'],
        ['wb', 'wp', '', '', '', '', 'bp', 'bb'],
        ['wq', 'wp', '', '', '', '', 'bp', 'bq'],
        ['wk', 'wp', '', '', '', '', 'bp', 'bk'],
        ['wb', 'wp', '', '', '', '', 'bp', 'bb'],
        ['wk', 'wp', '', '', '', '', 'bp', 'bk'],
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
                        moves.moves.should.eql([[x, 2]]);
                    } else {
                        moves.moves.should.eql([[x, 5]]);
                    }

                    moves.attacks.should.have.length(0);
                });
            });
        });
    });
});
