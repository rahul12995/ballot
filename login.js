var express = require('express')
    , http = require('http'), mongoose = require('mongoose');
var bodyParser = require('body-parser');
var qs = require('qs');
ObjectId = mongoose.Types.ObjectId;


var loginDetails = require('./dbConnection').loginDetails;

var app = express();

app.use(express.static(__dirname));


console.log('Listening on port 8000 login.js');


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


app.post('/getallusers', function (req, res) {


    loginDetails.find({}, function (err, data) {

        if (err) {

            console.log('no data found');

        }

        //if user found.
        if (data.length != 0) {


            res.send(data);
            console.log("found " + req.body.email);

        }
        else {

            res.send("not");
            console.log("not found");

        }
    });
});


app.post('/inserttoken', function (req, res) {


    loginDetails.findOneAndUpdate({"_id": ObjectId(req.body.userId)},
        {

            $set: {
                token: req.body.token
            }
        },
        {new: true},
        function (err, doc) {
            if (err) {
                console.log("Something wrong when updating data!");
            } else {
                if (doc != null) {
                    console.log("Token updated");
                    console.log(doc);
                    res.send("updated");
                }
            }
        });


});


app.get('/hello', function (req, res) {

    console.log("hello");
    res.send("hello");
    res.setHeader('content-type', 'text/javascript');
    // res.setHeader('Access-Control-Allow-Origin', 'http://192.168.43.123:5010');
    // res.setHeader('Access-Control-Allow-Credentials', true);
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    //
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

});
module.exports.app = app;