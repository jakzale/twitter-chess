var feathers = require('feathers');
var mongoose = require('mongoose');

var log = console.log;

// Connect to the database
// TODO: Verify if it is supposed to be like this
var environment = process.env.NODE_ENV;

var db;
if (environment === 'test') {
    db = mongoose.connect('mongodb://localhost/chess-test');
}
else {
    db = mongoose.connect('mongodb://localhost/chess');
}

// Loading the models manually :P
require(__dirname + '/app/models');

// Loading services
var move_service = require(__dirname + '/app/service');

var app = feathers();

// Serving static files
app.use(feathers.static(__dirname + '/public'));

// Setting up the template engine to jade
app.set('view engine', 'jade');

// Use socket io
app.configure(feathers.primus({ transformer: 'sockjs' }));

// Use the todoService
app.use('/game', move_service);

// Render the index page
app.get('/', function(req, res){
    res.render('index');
});

// Start listening on port
app.listen(8000);

console.log('Server running on 8000');

module.exports = app;
