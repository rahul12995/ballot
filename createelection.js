var express = require('express')
    , http = require('http'), mongoose = require('mongoose');
var bodyParser = require('body-parser');
var qs = require('qs');
var request = require('request');
var util = require('util');
ObjectId = mongoose.Types.ObjectId;


var loginDetails = require('./dbConnection').loginDetails;
var collegeDetails = require('./dbConnection').collegeDetails;
var electionDetails = require('./dbConnection').electionDetails;

var app = express();

app.use(express.static(__dirname));


console.log('Listening on port 8000 signup.js');

function sendMessageToUser(deviceId, message, title, notificationid, data2) {
    request({
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
            'Content-Type': ' application/json',
            'Authorization': 'key=AAAAukq3sDY:APA91bHZphn7LZqVuPtDsj2oF646Z3naZWXZcQqcgjJ-vB4HOyr1YbgUpxOpfmLbbW5E1y93Xr_u6A9hxG6aRHG5Oyl0iyk-N9GeHvYHDx6UI8rd88_fHVqVXSZQa439QMBDKk8p8gIg'
        },
        body: JSON.stringify(
            {
                "data": {
                    "message": message,
                    "title": title,
                    "notificationid": notificationid,
                    "data": data2
                },
                "to": deviceId
            }
        )
    }, function (error, response, body) {
        if (error) {
            console.error(error, response, body);
        }
        else if (response.statusCode >= 400) {
            console.error('HTTP Error: ' + response.statusCode + ' - ' + response.statusMessage + '\n' + body);
        }
        else {
            console.log('Done!')
        }
    });
}

app.post('/insert', function (req, res) {

    var electiondata = new electionDetails({

        electionName: req.body.electionName,
        electionDate: req.body.electionDate,
        electionTime: req.body.electionTime,
        createdElectionDateTime: req.body.createdElectionDateTime,
        voterList: JSON.parse(req.body.voterList),
        candidateList: JSON.parse(req.body.candidateList),
        createdElectionAdmin: req.body.createdElectionAdmin,
        createdElectionAdminName: req.body.createdElectionAdminName,
        electionStart: req.body.electionStart

    }).save(function (error, data) {
        if (error) {
            console.error(error + "not saved");
        }
        if (data != null) {


            res.send("done");

            for (var i = 0; i < data.voterList.length; i++) {


                if (data.voterList[i].userId != req.body.sessionUserId) {

                    loginDetails.findOne({_id: ObjectId(data.voterList[i].userId)}, {password: 0}, function (err, data2) {

                        if (err) {

                            console.log('no data found');

                        }

                        //if user found.
                        if (data2 != null) {

                            var data3 = {electionId: data._id, notificationId: "1"};
                            console.log("ddddd" + data._id);
                            console.log("ddddd" + data2._id);
                            sendMessageToUser(data2.token, req.body.sessionUserName + " invited you to participate in online voting", req.body.electionName, "1", data3);


                        }

                    });

                }


            }


            console.log(data);

        }
        else {
            res.send("not");
        }

    });

});
app.post('/getallelections', function (req, res) {

    var finaldata = [];

    electionDetails.find({}, function (err, data) {

        if (err) {

            console.log('no data found');

        }

        //if user found.
        if (data.length != 0) {


            for (var i = 0; i < data.length; i++) {

                for (var j = 0; j < data[i].voterList.length; j++) {

                    if (data[i].voterList[j].userId == req.body.userId) {

                        finaldata.push(data[i]);
                        break;

                    }

                }

            }
            if(finaldata.length>0){
            res.send(finaldata);
        }
        else{

            res.send("not");
            console.log("not found");
            
        }

        }
        else {

            res.send("not");
            console.log("not found");

        }
    });
});

app.post('/getelectiondetail', function (req, res) {


    electionDetails.findOne({_id: ObjectId(req.body.electionId)}, function (err, data) {

        if (err) {

            console.log('no data found');

        }

        //if user found.
        if (data != null) {


            res.send(data);

        }
        else {

            res.send("not");
            console.log("not found");

        }
    });
});


app.post('/deletemember', function (req, res) {
    var member = req.body.member;
    var electionId = req.body.electionId;
    var jsonmember = JSON.parse(member);
    console.log(jsonmember.memberId);


    electionDetails.findOneAndUpdate({"_id": ObjectId(electionId)},
        {
            $pull: {
                voterList: {userId: jsonmember.memberId}
            }
        }
        , function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("removed");
                console.log(data);
                res.send("removed");
            }
        });
});


app.post('/changevoterstatus', function (req, res) {

    var electionId = req.body.electionId;

    electionDetails.update(
        {"_id": ObjectId(electionId), "voterList.userId": req.body.userId},

        {
            "$set": {
                "voterList.$.status": 'accept'

            }

        }

        ,
        function (err, data) {
            if (err) console.log("No data found");
            else {


                electionDetails.update(
                    {"_id": ObjectId(electionId), "candidateList.userId": req.body.userId},

                    {
                        "$set": {
                            "candidateList.$.status": 'accept'

                        }

                    }

                    ,
                    function (err, data) {
                        if (err) console.log("No data found");
                        else {
                            res.send("updated");


                        }

                    }
                );


            }

        }
    );

});


app.post('/changeelectionstartstatus', function (req, res) {

    var electionId = req.body.electionId;

    electionDetails.update(
        {"_id": ObjectId(electionId)},

        {
            "$set": {
                "electionStart": 'start'

            }

        }

        ,
        function (err, data) {
            if (err) console.log("No data found");
            else {
                console.log("updated");
                res.send("updated");

            }

        }
    );

});

app.post('/getcandidatelist', function (req, res) {


    var candidateList = JSON.parse(req.body.candidateList);
    console.log("sssss:" + util.inspect(candidateList, {showHidden: false, depth: null}));

    var finalData = [];

    loginDetails.find({}, function (err, data) {

        if (err) {

            console.log('no data found');

        }

        //if user found.
        if (data.length != 0) {

            for (var i = 0; i < candidateList.length; i++) {

                for (var j = 0; j < data.length; j++) {

                    if (candidateList[i].userId == data[j]._id && candidateList[i].status == 'accept') {

                        finalData.push(data[j]);
                        break;

                    }

                }

            }
            res.send(finalData);
            console.log(finalData)

        }
        else {

            res.send("not");
            console.log("not found");

        }
    });


});


app.post('/givecandidatevote', function (req, res) {

    var electionId = req.body.electionId;
    var candidateId = req.body.candidateId;


    var count;
    electionDetails.findOne({"_id": ObjectId(electionId), "candidateList.userId": candidateId}, function (err, data) {

        if (err) {

            console.log('no data found');

        }

        //if user found.
        if (data != null) {

            for (var a = 0; a < data.candidateList.length; a++) {

                if (data.candidateList[a].userId == candidateId) {

                    count = parseInt(data.candidateList[a].votes);
                    count++;
                    break;

                }


            }


            electionDetails.update(
                {"_id": ObjectId(electionId), "candidateList.userId": candidateId},

                {
                    "$set": {
                        "candidateList.$.votes": count

                    }

                }

                ,
                function (err, data) {
                    if (err) console.log("No data found");
                    else {

                        electionDetails.update(
                            {"_id": ObjectId(electionId), "voterList.userId": req.body.voterId},

                            {
                                "$set": {
                                    "voterList.$.givevote": 'done'

                                }

                            }

                            ,
                            function (err, data) {
                                if (err) console.log("No data found");
                                else {


                                    res.send("updated");
                                    console.log("updated");

                                }

                            }
                        );

                    }

                }
            );

        }
        else {

            res.send("not");
            console.log("not found");

        }
    });


});

app.post('/stopelection', function (req, res) {

    var electionId = req.body.electionId;


    electionDetails.findOne({"_id": ObjectId(electionId)}, function (err, data) {

            if (err) {

                console.log('no data found');

            }

            //if user found.
            if (data != null) {
                var greatest;
                var finaldata = [];
                greatest = parseInt(data.candidateList[0].votes);

                for (var i = 0; i < data.candidateList.length; i++) {

                    if (parseInt(data.candidateList[i].votes) > greatest) {
                        greatest = parseInt(data.candidateList[i].votes);
                    }
                }
                for (var j = 0; j < data.candidateList.length; j++) {

                    if (greatest == parseInt(data.candidateList[j].votes)) {
                        finaldata.push(data.candidateList[j])
                    }
                }

                electionDetails.update(
                    {"_id": ObjectId(electionId)},

                    {
                        "$set": {
                            "electionStart": 'end',
                            "result": finaldata
                        }

                    }

                    ,
                    function (err, data) {
                        if (err) console.log("No data found");
                        else {


                            res.send("updated");
                            console.log("updated");
                            console.log(data);

                        }

                    }
                );



            }
            else {

                res.send("not");
                console.log("not found");

            }
        }
    );

});

app.post('/getcandidatelistforendvoting', function (req, res) {


    var candidateList = JSON.parse(req.body.candidateList);
    console.log("sssss:" + util.inspect(candidateList, {showHidden: false, depth: null}));

    var finalData = [];

    loginDetails.find({}, function (err, data) {

        if (err) {

            console.log('no data found');

        }

        //if user found.
        if (data.length != 0) {

            for (var i = 0; i < candidateList.length; i++) {

                for (var j = 0; j < data.length; j++) {

                    if (candidateList[i].userId == data[j]._id && candidateList[i].status == 'accept') {

                       // var tempdata = {data:data[j],votes:candidateList[i].votes};
                        var _id = data[j]._id; 
                        var userName = data[j].userName; 
                        var email = data[j].email; 
                        var phone = data[j].phone; 
                        var rollNo = data[j].rollNo; 
                        var branch = data[j].branch; 
                        var StudentCollegeId = data[j].StudentCollegeId; 
                        var collegeName = data[j].collegeName; 
                        var collegeCode = data[j].collegeCode; 
                        var votes = candidateList[i].votes; 
                        var tempdata ={_id:_id,userName:userName,email:email,phone:phone,rollNo:rollNo,branch:branch,
                        StudentCollegeId:StudentCollegeId,collegeName:collegeName,collegeCode:collegeCode,votes:votes};
                        finalData.push(tempdata);
                        break;

                    }

                }

            }
            res.send(finalData);
            console.log(finalData)

        }
        else {

            res.send("not");
            console.log("not found");

        }
    });


});

module.exports.app = app;