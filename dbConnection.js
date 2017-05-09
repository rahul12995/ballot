var mongoose = require('mongoose');


// connect to database
mongoose.Promise = global.Promise;
//mongoose.connect('localhost:27017/ballotvoting');
mongoose.connect('mongodb://root:root@ds163940.mlab.com:63940/ballotvoting');

var connection = null;

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error', err);
});
db.once('open', function () {
    console.log('connected.');
});



var loginSchema = new mongoose.Schema({

    userName:{type:String},
    email: {type:String},
    phone: {type:String},
    password:{type:String},
    rollNo:{type:String},
    branch:{type:String},
    StudentCollegeId:{type:String},
    collegeCode:{type:String},
    collegeName:{type:String},
    verifycode:{type:String},
    token:{type:String}


},{ collection: 'loginDetails'  ,versionKey: false });


var collegeSchema = new mongoose.Schema({


    collegeName:{type:String},
    collegeCode:{type:String}


},{ collection: 'collegeDetails'  ,versionKey: false });

var electionSchema = new mongoose.Schema({


    electionName:{type:String},
    electionDate:{type:String},
    electionTime:{type:String},
    createdElectionDateTime:{type:String},
    voterList:[],
    candidateList:[],
    createdElectionAdmin:{type:String},
    createdElectionAdminName:{type:String},
    electionStart:{type:String},
    result:[]


},{ collection: 'electionDetails'  ,versionKey: false });

var slider = new mongoose.Schema({


    image:String


},{ collection: 'sliderDetails'  ,versionKey: false });




module.exports.loginDetails = mongoose.model('loginDetails',loginSchema);
module.exports.collegeDetails = mongoose.model('collegeDetails',collegeSchema);
module.exports.electionDetails = mongoose.model('electionDetails',electionSchema);
module.exports.sliderDetails = mongoose.model('sliderDetails',slider);
