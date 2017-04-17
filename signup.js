var express = require('express')
    , http = require('http'), mongoose = require('mongoose');
var bodyParser = require('body-parser');
var qs = require('qs');
ObjectId = mongoose.Types.ObjectId;



var loginDetails = require('./dbConnection').loginDetails;
var collegeDetails = require('./dbConnection').collegeDetails;

var app = express();

app.use(express.static(__dirname));


console.log('Listening on port 8000 signup.js')

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(bodyParser.json());





app.post('/insertuserdata', function (req, res) {

    var userdata = new loginDetails({

        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        rollNo: req.body.rollNo,
        branch: req.body.branch,
        StudentCollegeId: req.body.StudentCollegeId,
        collegeCode: req.body.collegeCode

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


app.post('/insertcollegedata', function (req, res) {

    var collegedata = new collegeDetails({

        collegeName: req.body.collegeName,
        collegeCode: req.body.collegeCode

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

app.post('/getcollegedetails', function (req, res) {

    collegeDetails.find({}, function (err, data) {

        if (err) {

            console.log('no data found');

        }
        console.log(data);
        //if user found.
        if (data != null) {

            res.json({result:"found",data:data});
            console.log({result:"found"});
        }
        else {
            console.log("not found");
            res.json({result: "not"});
        }
    });



});

app.post('/insertuser', function (req, res) {

    var useredata = new loginDetails({

        userName:req.body.name ,
        email:req.body.email ,
        phone:req.body.phone ,
        password:req.body.password,
        rollNo:req.body.rollNo,
        branch:req.body.branch,
        StudentCollegeId:req.body.collegeId,
        collegeCode:req.body.collegeCode

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