var chess   = require('../../client/chess');
var should  = require('should');

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
            moves.should.have.length(0);
        });
    });
});
