var express = require('express')
    ,mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname));
console.log('Listening on port 3001 app.js');

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(bodyParser.json());


app.use('/login', require('./login').app);
app.use('/signup', require('./signup').app);
app.use('/forgotpassword', require('./forgotpassword').app);
app.use('/createelection', require('./createelection').app);
app.use('/slider', require('./slider').app);

app.listen('8002', '0.0.0.0', function() {
    console.log('Listening to port:  ' + 3000);
});