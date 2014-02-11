var _ = require('underscore');

function update_trees(moves, trees) {
    // tree: { index_cache: {}, tree: []}
    if (trees === undefined) { trees = []; }

    return _.foldl(moves, function(trees, move) {
        var tree_id = -1;

        // If the current move is already in the tree, we don't want
        // to add it for the second time
        if (_.some(trees, function(tree) {
            return tree.index_cache[move.self_id] !== undefined; })) {
                return trees;
            }

        if (!_.some(trees, function(tree) {
            return tree.index_cache[move.parent_id] !== undefined; }))
        {
            trees.push({index_cache: {}, tree: []});
            tree_id = trees.length - 1;
        } else {
            _.each(trees, function(tree, id) {
                if (tree.index_cache[move.parent_id] !== undefined) {
                    tree_id = id;
                }});
        }

        var our_tree = trees[tree_id];
        // Add the current move to cache
        our_tree.index_cache[move.self_id] = our_tree.tree.length;

        // Add the move to the tree
        our_tree.tree.push(_.extend(move, {
            children: [],
            parent_index: our_tree.index_cache[move.parent_id]
        }));

        // Link the parent, if the parent doesn't exist, don't link
        var parent = our_tree.tree[our_tree.index_cache[move.parent_id]];
        if (parent) { children.push(move.self_id); }

        // TODO:
        // If a new root is added, it needs to be linked inside the
        // tree structure

        return trees;
    }, trees);
}

var valid_moves = {
    k: {
        moves: [[1, 0], [1, 1], [0, 1], [-1, 1],
            [-1, 0], [-1, -1], [0, -1], [1, -1]],
        max_mult: 1
    },
    q: {
        moves: [[1, 0], [1, 1], [0, 1], [-1, 1],
            [-1, 0], [-1, -1], [0, -1], [1, -1]],
        max_mult: 8
    },
    r: {
        moves: [[0, 1], [1, 0], [0, -1], [-1, 0]],
        max_mult: 8
    },
    n: {
        moves: [[1, 2], [-1, 2], [2, 1], [2, -1],
            [1, -2], [-1, -2], [-2, 1], [-2, -1]],
        max_mult: 1
    },
    b: {
        moves: [[-1, 1], [1, 1], [1, -1], [-1, -1]],
        max_mult: 8
    },
    p: {
        moves: [[0, 1], [0, 2]],
        attack: [[-1, 1], [1, 1]],
        max_mult: 1
    }
}

function find_moves(board, x, y, possible_moves, figure_moves,
                    push_to, valid, attack) {
    var figure  = board[x][y].slice(1),
        color   = board[x][y][0],
        y_mult  = color === "w" ? 1 : -1;

    _.each(possible_moves, function(move) {

        // _.every is a breakable _.each
        _.every(_.range(figure_moves[figure].max_mult), function(iter) {
            var i = parseInt(iter) + 1;
            var new_x = move[0] * i + x,
                new_y = move[1] * i * y_mult + y;

            // For a double pawn move
            if (figure === 'p' && !((y === 1 && color === 'w') ||
                                   (y === 6 && color === 'b'))) {
                return true;
            }

            if (new_x < 8 && new_x > -1 && new_y > -1 && new_y < 8) {
                if (color !== board[new_x][new_y][0]) {
                    if (board[new_x][new_y][0] === undefined) {
                        if (!attack) push_to.push([new_x, new_y]);
                    } else {
                        if ((figure === 'p' && attack) || figure !== 'p')
                            valid.attacks.push([new_x, new_y]);
                    }
                } else {
                    if ((figure === 'p' && attack) || figure !== 'p')
                        valid.protections.push([new_x, new_y]);

                    return false;
                }
            } else return false;

            return true;
        });
    });
}


function get_valid_moves(board, x, y, figure_moves, recurse_king) {
    var valid   = {moves: [], attacks: [], protections: []},
        figure  = board[x][y].slice(1),
        color   = board[x][y][0],
        opponent_color;

    if (!figure) return valid;
    if (recurse_king === undefined) recurse_king = true;
    if (figure_moves === undefined) figure_moves = valid_moves;

    if (color === 'w') {
        opponent_color = 'b';
    } else {
        opponent_color = 'w';
    }

    // Check where the figure can move
    find_moves(board, x, y, figure_moves[figure].moves,
               figure_moves, valid.moves, valid, false);

    // If the figure has distinct attack patterns
    if (_.contains(_.keys(figure_moves[figure]), 'attack')) {
        find_moves(board, x, y, figure_moves[figure].attack,
                   figure_moves, valid.attacks, valid, true);
    }


    // If the figure is a king, check if the moves are
    // not on an attacked field
    if (figure == 'k' && recurse_king) {
        valid.moves = _.foldl(valid.moves, function(valid_moves, move) {
            if (get_checks(board, move[0], move[1]).length === 0)
                valid_moves.push(move);
            return valid_moves;
        }, []);
    }

    return valid;
}

// Check if there is a check on the board
function get_checks(board, x, y) {
    var checks = [];

    _.each(_.range(8), function(x) {
        _.each(_.range(8), function(y) {
            var figure  = board[x][y].slice(1),
                color   = board[x][y][0];

            if (color === undefined) return;
            var moves = get_valid_moves(board, x, y);

            _.each(moves.attacks + moves.moves, function(move) {
                if ((board[move[0]][move[1]][1] === 'k'
                     && x === undefined && y === undefined) ||
                    (move[0] === x && move[1] === y))
                {
                    checks.push({
                        attacker: {x: x, y: y},
                        checked: {x: move[0], y: move[1]}
                    });
                }
            });
        });
    });

    return checks;
}

// If true, the checkmate occured
function is_checkmate(board, current_color) {

    // Get the checks concerning the current king
    var checks = _.foldl(get_checks(board),
                         function(passed_checks, check) {
        var x = check.checked.x,
            y = check.checked.y;
        if (board[x][y][0] === current_color)
            passed_checks.push(check);
        return passed_checks;
    }, []);

    // If there are no checks on the current king,
    // return false
    if (checks.length === 0) return false;

    var k_x = checks[0].checked.x,
        k_y = checks[0].checked.y;

    // If the king can escape, there is definitely no
    // checkmate
    var king_moves = get_valid_moves(board, k_x, k_y);
    if (king_moves.length > 0) return false;

    // If the attacker can be mitigated,
    // there is no checkmate
    return _.every(_.checks, function(check) {
        var attacker_moves  = get_valid_moves(board, check.attacker.x,
                                                     check.attacker.y),
            a_x             = check.attacker.x,
            a_y             = check.attacker.y;

        return _.every(_.range(8), function(x) {
            return _.every(_.range(8), function(y) {
                // Only pieces of the same color as the king can
                // protect it, apart from the king itself
                if ((x === k_x && y === k_y) ||
                    board[x][y][0] !== board[k_x][k_y][0]) {
                    return true;
                }

                var figure_moves = get_valid_moves(board, x, y);

                // If the figure can beat the attacker
                var attacker_beaten =
                    _.every(figure_moves.attacks, function(move) {
                        if (move[0] === a_x && move[1] === a_y)
                            return false;
                        return true;
                });

                if (attacker_beaten) return false;

                // If the figure can shield the king
                // from the attacker with itself
                var not_shielded =
                    _.every(attacker_moves.moves, function(att_move) {
                        return _.every(figure_moves.moves, function(fig_move) {
                            if (fig_move[0] === att_move[0] &&
                                fig_move[1] === att_move[1])
                                return false;
                            return true;
                        });
                });
                if (not_shielded) return false;
                return true;
            });
        });
    });
}


// Check if the second board can
// occur after the first board
function validate_gamestep(start_board, end_board, current_color) {
    if (current_color === undefined) current_color = 'w';

    var errors  = [],
        moves   = 0;

    _.each(_.range(8), function(x) {
        _.each(_.range(8), function(y) {
            if (start_board[x][y] !== end_board[x][y]) {
                var possible_moves = get_valid_moves(start_board, x, y);
            }
        });
    });
}





module.exports = {
    update_trees: update_trees,
    get_valid_moves: get_valid_moves,
    is_checkmate: is_checkmate
}

