var mongoose = require('mongoose');
var uristring  = require('../config').mongo;

mongoose.Promise = global.Promise;
// 'mongodb://localhost/third';
//Connect to Database

module.exports.connect = function connect() {
    var t = setInterval(() => {
        console.log("Tryingt to connect to Mongoose");
    }, 1000);

    mongoose
        .connect(uristring, function (err, res) {

            clearInterval(t);
            if (err) {
                console.log('ERROR connecting to: remote' + uristring + '. ' + err);
            } else {
                console.log('Successfully connected to: remote' + uristring);
            }
        });
}

