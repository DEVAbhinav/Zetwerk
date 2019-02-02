var _ = require('lodash');
var counter = require("../models/counter");
init = {};
init.counter = function () {
    counter.find({
        _id: 'employee'
    }, {}, function initiatingCounter(err, res) {
        if (_.isEmpty(res) || err) {
            counter.create({
                _id: 'employee',
                seq: 0
            }, function counterInitCB(err) {
                if (err)
                    console.log("Unable to initialize counter");
                else
                    console.log("Initialized Successfully");
            })
        } else
            console.log("already initalized-" + res);
    })
}


module.exports = init;