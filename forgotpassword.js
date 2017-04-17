var express = require('express')
    , http = require('http'), mongoose = require('mongoose');
var bodyParser = require('body-parser');
var qs = require('qs');
ObjectId = mongoose.Types.ObjectId;


var loginDetails = require('./dbConnection').loginDetails;

var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname));


console.log('Listening on port 8000 login.js')

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(bodyParser.json());


app.get('/verifymail/:email/:verifycode', function (req, res,next) {


    loginDetails.findOne({email:req.params.email,verifycode:req.params.verifycode},function(err,data){

        if (err) {

            console.log('no data found');
            res.send("error");

        }

        //if user found.
        if (data!=null) {

            res.render('forgotpassword',{email:req.params.email,verifycode:req.params.verifycode});

        }
        else{


            console.log("not"+ req.params.email+req.params.verifycode);
            res.send({result:req.params.email});
        }
    });





});



app.post('/checkmail', function (req, res) {


    loginDetails.find({"email":req.body.email},function(err,data){

        if (err) {

            console.log('no data found');

        }

        //if user found.
        if (data.length!=0) {




            loginDetails.update({"email":req.body.email},

                {  $set: {"verifycode": req.body.verifycode}
                },function(err, object) {
                    if (err){
                        console.warn(err.message);  // returns error if no matching object found
                    }else{
                        res.send("found");
                        console.log("Update Sucessfully !!");
                    }});
            console.log("found "+ req.body.email);

        }
        else{


            console.log("not"+ req.body.email);
            res.send("not");
        }
    });



});

app.post('/returnforgotpassword', function (req, res,next) {




    loginDetails.update({"email":req.body.email},

        {

            $set: {"password": req.body.confirmpass}

        },function(err, object) {
            if (err){
                console.warn(err.message);  // returns error if no matching object found
            }else{
                res.send("password changed successfully");
                console.log("Update Sucessfully !!");
            }});




});



module.exports.app = app;