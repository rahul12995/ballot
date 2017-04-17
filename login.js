var express = require('express')
    , http = require('http'), mongoose = require('mongoose');
var bodyParser = require('body-parser');
var qs = require('qs');
ObjectId = mongoose.Types.ObjectId;


var loginDetails = require('./dbConnection').loginDetails;

var app = express();

app.use(express.static(__dirname));


console.log('Listening on port 8000 login.js')

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(bodyParser.json());


app.post('/checkemailorphone', function (req, res) {


    loginDetails.find({"email": req.body.email}, function (err, data) {

        if (err) {

            console.log('no data found');

        }

        //if user found.
        if (data.length != 0) {


            res.send("foundEmail");
            console.log("found " + req.body.email);

        }
        else {

            loginDetails.find({"phone": req.body.phone}, function (err, data) {

                if (err) {

                    console.log('no data found');

                }

                //if user found.
                if (data.length != 0) {


                    res.send("foundPhone");

                }
                else {

                    res.send("not");

                }
            });


        }
    });


});


app.post('/checkloginuserdetails', function (req, res) {


    loginDetails.findOne({"email": req.body.email, "password": req.body.password}, function (err, data) {

        if (err) {

            console.log('no data found');

        }

        //if user found.
        if (data != null) {


            res.send(data);
            console.log("found " + req.body.email);

        }
        else {

            res.send("not");
            console.log("not found");

        }
    });


});


module.exports.app = app;