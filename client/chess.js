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

function get_valid_moves(board, x, y, recurse_king) {
    var valid   = {moves: [], attacks: [], protections: []},
        figure  = board[x][y].slice(1),
        color   = board[x][y][0],
        opponent_color;

    if (!figure) return valid;
    if (recurse_king === undefined) recurse_king = true;

    if (color === 'w') {
        opponent_color = 'b';
    } else {
        opponent_color = 'w';
    }

    var y_mult = board[x][y][0] === "w" ? 1 : -1;

    function find_moves(possible_moves, push_to, attack) {
        _.each(possible_moves, function(move) {
            for (var iter in _.range(valid_moves[figure].max_mult)) {
                var i = parseInt(iter) + 1;
                var new_x = move[0] * i + x,
                    new_y = move[1] * i * y_mult + y;

                // For a double pawn move
                if (figure === 'p' && !((y === 1 && color === 'w') ||
                                       (y === 6 && color === 'b'))) {
                    continue;
                }

                if (new_x < 8 && new_x > -1 && new_y > -1 && new_y < 8) {
                    if (color !== board[new_x][new_y][0]) {
                        if (board[new_x][new_y][0] === undefined) {
                            if (!attack) push_to.push([new_x, new_y]);
                        } else {
                            valid.attacks.push([new_x, new_y]);
                        }
                    } else {
                        valid.protections.push([new_x, new_y]);
                        break;
                    }
                } else break;

            }
        });
    }

    // Check where the figure can move
    find_moves(valid_moves[figure].moves, valid.moves, false);

    // If the figure has distinct attack patterns
    if (_.contains(_.keys(valid_moves[figure]), 'attack')) {
        find_moves(valid_moves[figure].attack, valid.attacks, true);
    }


    // If the figure is a king, check if the moves are
    // not on an attacked field
    if (figure == 'k' && recurse_king) {
        // Get all fields attacked by the opponent
        var attacked =
            _.foldl(_.range(8), function(memo, x) {
                _.each(_.range(8), function(y) {
                    if (board[x][y][0] == opponent_color) {
                        var moves = get_valid_moves(board, x, y, false);
                        memo.push({x: x,
                                   y: y,
                                   moves: moves});
                    }
                });

                return memo;
        }, []);

        var attacked_fields = _.uniq(_.foldl(attacked,
            function(all_fields, figure) {
                return all_fields + figure.protections + figure.moves;
        }, []));

        valid.moves = _.foldl(valid.moves, function(valid_moves, move) {
            var is_valid = true;
            _.each(attacked_fields, function(field) {
                if (field === move) {
                    is_valid = false;
                    return false;
                }
            });

            if (is_valid) valid_moves.push(move);
            return valid_moves;
        }, []);
    }


    return valid;
}


module.exports = {
    update_trees: update_trees,
    get_valid_moves: get_valid_moves
}

