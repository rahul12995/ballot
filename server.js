var express = require('express')
    ,mongoose = require('mongoose');

var app = express();

app.use(express.static(__dirname));
console.log('Listening on port 3001 app.js');

app.use('/login', require('./login').app);
app.use('/signup', require('./signup').app);
app.use('/forgotpassword', require('./forgotpassword').app);

app.listen(3000);