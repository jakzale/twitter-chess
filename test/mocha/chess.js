var chess   = require('../../client/chess');
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

    var pawn_board = [
        ['wr', '', 'wp', '', '', '', 'bp', 'br'],
        ['wn', 'wp', '', '', '', '', 'bp', 'bn'],
        ['wb', 'wp', 'bp', '', '', '', '', 'bb'],
        ['wq', 'wp', '', '', '', '', 'bp', 'bq'],
        ['wk', 'wp', '', '', '', '', 'bp', 'bk'],
        ['wb', 'wp', '', '', '', '', 'bp', 'bb'],
        ['wn', 'wp', '', '', '', '', 'bp', 'bn'],
        ['wr', 'wp', '', '', '', '', 'bp', 'br']
    ];

    var knight_board = [
        ['wr', 'wp', '', '', '', '', 'bp', 'br'],
        ['wn', 'wp', '', '', '', '', 'bp', ''],
        ['wb', 'wp', 'bn', '', '', '', 'bp', 'bb'],
        ['wq', 'wp', '', '', '', '', 'bp', 'bq'],
        ['wk', 'wp', '', '', '', '', 'bp', 'bk'],
        ['wb', 'wp', '', '', '', '', 'bp', 'bb'],
        ['wn', 'wp', '', '', '', '', 'bp', 'bn'],
        ['wr', 'wp', '', '', '', '', 'bp', 'br']
    ];

    var bishop_board = [
        ['wr', 'wp', '', '', '', '', 'bp', 'br'],
        ['wn', 'wp', '', '', '', '', 'bp', 'bn'],
        ['wb', 'wp', '', '', '', '', 'bp', 'bb'],
        ['wq', '', '', '', '', '', 'bp', 'bq'],
        ['wk', 'wp', '', '', '', '', 'bp', 'bk'],
        ['wb', 'wp', '', '', '', '', 'bp', ''],
        ['wn', 'wp', '', '', '', '', 'bp', 'bn'],
        ['wr', 'wp', '', '', '', 'bb', 'bp', 'br']
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

        it('should work for a simple pawn situation', function() {
            var moves = chess.get_valid_moves(pawn_board, 1, 1);
            moves.moves.contains([1,2]).should.be.ok;
            moves.moves.contains([1,3]).should.be.ok;
            moves.moves.should.have.length(2);

            moves.protections.contains([0,2]).should.be.ok;
            moves.protections.should.have.length(1);

            moves.attacks.contains([2,2]).should.be.ok;
            moves.attacks.should.have.length(1);
        });

        it('should work for knight in a simple situation', function() {
            var white_moves = chess.get_valid_moves(knight_board, 1, 0);
            white_moves.moves.contains([0,2]).should.be.ok;
            white_moves.moves.should.have.length(1);

            white_moves.attacks.contains([2,2]).should.be.ok;
            white_moves.attacks.should.have.length(1);

            white_moves.protections.contains([3,1]).should.be.ok;
            white_moves.protections.should.have.length(1);

            var black_moves = chess.get_valid_moves(knight_board, 2, 2);
            black_moves.moves.contains([0,3]).should.be.ok;
            black_moves.moves.contains([1,4]).should.be.ok;
            black_moves.moves.contains([3,4]).should.be.ok;
            black_moves.moves.contains([4,3]).should.be.ok;
            black_moves.moves.should.have.length(4);

            black_moves.attacks.contains([0,1]).should.be.ok;
            black_moves.attacks.contains([4,1]).should.be.ok;
            black_moves.attacks.contains([1,0]).should.be.ok;
            black_moves.attacks.contains([3,0]).should.be.ok;
            black_moves.attacks.should.have.length(4);

            black_moves.protections.should.have.length(0);
        });

        it('should work for bishop', function() {
            var white_moves = chess.get_valid_moves(bishop_board, 2, 0);
            white_moves.moves.contains([3,1]).should.be.ok;
            white_moves.moves.contains([4,2]).should.be.ok;
            white_moves.moves.contains([5,3]).should.be.ok;
            white_moves.moves.contains([6,4]).should.be.ok;
            white_moves.moves.should.have.length(4);

            white_moves.attacks.contains([7,5]).should.be.ok;
            white_moves.attacks.should.have.length(1);

            white_moves.protections.contains([1, 1]).should.be.ok;
            white_moves.protections.should.have.length(1);

            var black_moves = chess.get_valid_moves(bishop_board, 7, 5);
            black_moves.moves.contains([3,1]).should.be.ok;
            black_moves.moves.contains([4,2]).should.be.ok;
            black_moves.moves.contains([5,3]).should.be.ok;
            black_moves.moves.contains([6,4]).should.be.ok;
            black_moves.moves.should.have.length(4);

            black_moves.attacks.contains([2,0]).should.be.ok;
            black_moves.attacks.should.have.length(1);

            black_moves.protections.contains([6, 6]).should.be.ok;
            black_moves.protections.should.have.length(1);

        });
    });
});
