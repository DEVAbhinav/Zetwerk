var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectID = Schema.Types.ObjectId;
var counter = require('./counter');

var employee = new Schema({
    'id': {
        type: Number,
        unique: true,
        required: true,
        default: 0
    },
    'name': {
        type: String,
        required: true
    },
    'imageURL': {
        type: String,
        required: true
    },
    'salary': {
        type: Number,
        required: true
    },
    'skills': [String],
    'dob': {
        type: String
    }
});

employee.index({ name: 'text', salary: 'text', skills: 'text'});

employee.pre('save', function (next) {
    var doc = this;
    counter.findByIdAndUpdate({
        _id: 'employee'
    }, {
        $inc: {
            seq: 1
        }
    }, function (error, counter) {
        if (error)
            return next(error);
        doc.id = counter.seq;
        next();
    });
});

var Employee = mongoose.model('employee', employee);
module.exports = Employee;