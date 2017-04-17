var mongoose = require('mongoose');


// connect to database
mongoose.Promise = global.Promise;
mongoose.connect('localhost:27017/ballotvoting');
//mongoose.connect('mongodb://trackily:root@ds111940.mlab.com:11940/trackily');

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
    verifycode:{type:String}


},{ collection: 'loginDetails'  ,versionKey: false });


var collegeSchema = new mongoose.Schema({


    collegeName:{type:String},
    collegeCode:{type:String}






},{ collection: 'collegeDetails'  ,versionKey: false });


module.exports.loginDetails = mongoose.model('loginDetails',loginSchema);
module.exports.collegeDetails = mongoose.model('collegeDetails',collegeSchema);
