var _       = require('underscore'),
    libs    = require('./libs');

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

// Propagate the board
function move(board, x, y, end_x, end_y) {
    var clone   = JSON.parse(JSON.stringify(board)),
        figure  = board[x][y];

    clone[x][y] = '';
    clone[end_x][end_y] = figure;
    return clone;
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

function get_valid_moves(board, x, y, figure_moves, recurse) {
    var valid   = {moves: [], attacks: [], protections: []},
        figure  = board[x][y].slice(1),
        color   = board[x][y][0],
        opponent_color;

    if (!figure) return valid;
    if (recurse === undefined) recurse = true;
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
    if (figure === 'k' && recurse) {
        valid.moves = _.foldl(valid.moves, function(valid_moves, move) {
            if (get_checks(board, move[0], move[1]).length === 0)
                valid_moves.push(move);
            return valid_moves;
        }, []);
    }

    // If there are checks on a king, and the figure is not a king,
    // only moves stopping the check are possible

    if (figure !== 'k' && figure !== undefined && recurse) {
        var checks = _.filter(get_checks(board, undefined, undefined, recurse),
                              function(check) {
            if (board[check.checked.x][check.checked.y][0] === color)
                return true;
            return false;
        });

        if (checks.length === 0) return valid;

        var attacks = [],
            moves   = [];

        _.each(checks, function(check) {
            attacks.push(_.filter(valid.attacks, function(move) {
                return mitigate_by_move(board, check, x, y, move[0], move[1]);
            }));

            moves.push(_.filter(valid.moves, function(move) {
                return mitigate_by_move(board, check, x, y, move[0], move[1]);
            }));
        });

        valid.moves = _.uniq(moves, false, libs.stringify);
        valid.attacks = _.uniq(attacks, false, libs.stringify);
    }

    return valid;
}

// Check if there is a check on the board
function get_checks(board, x, y, recurse) {
    var checks = [];
    if (recurse === undefined) recurse = true;

    _.each(_.range(8), function(x) {
        _.each(_.range(8), function(y) {
            var figure  = board[x][y].slice(1),
                color   = board[x][y][0];

            if (color === undefined) return;
            var moves = get_valid_moves(board, x, y, valid_moves, false);

            _.each(libs.join_arrs(moves.attacks, moves.moves), function(move) {
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

function mitigate_by_move(board, check, start_x, start_x,
                          end_x, end_y)
{

    var k_x     = check.checked.x,
        k_y     = check.checked.y,
        a_x     = check.attacker.x,
        a_y     = check.attacker.y,
        k_color = board[k_x][k_y][0],
        a_color = board[a_x][a_y][0];

    // If the figure can beat the attacker
    if (end_x === a_x && end_y === a_y) return true;

    var new_board = move(board, start_x, start_y, end_x, end_y);
    var this_check = _.filter(get_checks(new_board),
                              function(check) {
        if (check.attacker.x === a_x &&
            check.attacker.y === a_y &&
            check.checked.x === k_x &&
            check.checked.y === k_y)
            return true;
        return false;
    });

    if (this.check.length === 0) return true;
    return false;
}


// If true, the check can be mitigated
function can_mitigate(board, check) {
    var k_x     = check.checked.x,
        k_y     = check.checked.y,
        a_x     = check.attacker.x,
        a_y     = check.attacker.y,
        k_color = board[k_x][k_y][0],
        a_color = board[a_x][a_y][0];

    return !_.every(_.range(8), function(x) {
        return _.every(_.range(8), function(y) {
            if ((x === k_x && y === k_y) ||
                board[x][y][0] !== board[k_x][k_y][0]) {
                return true;
            }

            var figure_moves = get_valid_moves(board, x, y);
            figure_moves = _.filter(figure_moves, function(move) {
                return mitigate_by_move(board, check, x, y, move[0], move[1]);
            });
        });
    });
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

    // If the attacker can be mitigated, there is no checkmate
    return !_.every(_.checks, _.partial(can_mitigate, board));
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

