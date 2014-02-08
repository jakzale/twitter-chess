module.exports = {
    update_trees: update_trees,
    get_valid_moves: get_valid_moves
}


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
    k: {
        moves: [[1, 2], [-1, 2], [2, 1], [2, -1],
            [1, -2], [-1, -2], [-2, 1], [-2, -1]],
        max_mult: 1
    },
    b: {
        moves: [[-1, 1], [1, 1], [1, -1], [-1, -1]],
        max_mult: 8
    },
    p: {
        moves: [[0, 1]],
        attack: [[-1, 1], [1, 1]],
        max_mult: 1
    }
}

function get_valid_moves(board, x, y) {
    var figure = board[x][y].slice(1);
    var y_mult = board[x][y][0] === "w" ? 1 : -1;

    var moves = [];
    for (i in _.range(valid_moves[figure].max_mult)) {
        i += 1;

        _.each(valid_moves[figure].moves, function(move) {
            var new_x = move[0] * i + x,
                new_y = move[1] * i * y_mult + y;

            if (new_x < 8 && new_x > -1 && new_y > -1 && new_y < 8 &&
                board[x][y][0] !== board[new_x][new_y][0]) {
                moves.push([new_x, new_y]);
            }
        });
    }

    return moves;
}



