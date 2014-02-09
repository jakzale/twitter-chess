var libs    = require('../../client/libs');

describe('Libs tests', function() {
    'use strict';

    describe('Libs should work', function() {
        it('contains function works', function() {
            var test1 = [1, 2, 3];

            test1.contains(1).should.be.ok;
            test1.contains(2).should.be.ok;
            test1.contains(3).should.be.ok;

            test1.contains(4).should.not.be.ok;

            var test2 = [['lol', 1], 2];
            test2.contains(2).should.be.ok;
            test2.contains(1).should.not.be.ok;
            test2.contains(['lol', 1]).should.be.ok;
        });
    });
});

