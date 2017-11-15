/**
 * Module dependencies.
 */

var express = require('express')
    , bodyParser = require('body-parser')
    , users = require('./routes/users')

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
// app.use('/', index);
// app.use('/post', post);
app.use('/users', users);

app.listen(app.get('port'), function () {
    console.log('Express server listening at: http://localhost:%d/', app.get('port'));
});