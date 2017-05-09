var express = require('express')
    , http = require('http'), mongoose = require('mongoose');
var bodyParser = require('body-parser');
var qs = require('qs');
ObjectId = mongoose.Types.ObjectId;


var loginDetails = require('./dbConnection').loginDetails;
var sliderDetails = require('./dbConnection').sliderDetails;

var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname));


console.log('Listening on port 8000 login.js');



app.post('/', function (req, res) {
   
    sliderDetails.find({}
        , function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(data);
                res.send(data);
            }
        });
});



app.post('/insertslider', function (req, res) {

    var slider = new sliderDetails({

        image: req.body.image

    }).save(function (error, data) {
        if (error) {
            console.error(error + "not saved");
        }
        if (data != null) {


            res.send(data);
            console.log(data);

        }
        else {
            res.send("not");
        }

    });

});



module.exports.app = app;