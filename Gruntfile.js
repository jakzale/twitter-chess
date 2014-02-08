var fs = require('fs');

module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    nodeArgs: ['--debug'],
                    callback: function(nodemon) {
                        nodemon.on('log', function(event) {
                            console.log(event.colour);
                        });
                    }
                },
                ignore: ['node_modules/**'],
                ext: 'js',
                cwd: __dirname
            }
        },

        watch : {
            scripts : {
                files: ['client/*.js'],
                tasks: ['browserify']
            }
        },

        browserify : {
            dist : {
                files : {
                    'public/bundle.js' : ['client/*.js']
                }
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: 'server.js'
                },
                src: ['test/mocha/**/*.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['browserify', 'concurrent']);
    grunt.registerTask('test', 'mochaTest');
};
