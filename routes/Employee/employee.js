var _ = require('lodash');
var empl = {};
var utils = require('../utils');
var fs = require('fs');
var util = require('util');
var Employee = require('../../models/employee');


empl.validateRequest = function (req, res, next) {

    var {
        body
    } = req;

    var allColumn = ["emp_id", "dob", "salary", "skills", "name", "imgURL"];

    var postColumn = ["dob", "salary", "skills", "name"];

    nullCheckFailed = false;
    postColumn.forEach(function checkingEntry(element) {
        if (!body[element])
            nullCheckFailed = true;
    });

    nullCheckFailed = nullCheckFailed || !body.skills.length;


    if (nullCheckFailed)
        return res.json({
            message: "please fill all the mandatory Details",
            redirect: "none",
            result: false
        });

    body.salary = parseInt(body.salary)
    if (!_.isNumber(body.salary)) {
        return res.json({
            valid: 0,
            message: "Salary is no Number",
            redirect: "none",
        });
    }



    // TODO add check on skills if skills values are fixed  

    next();
}



empl.add = function (req, res, next) {

    if (!req.file) {
        util.log("No file received");
        return res.send({
            valid: 0,
            comment: "No Files Received"
        });
    }

    const host = req.host;
    const imageURL = req.protocol + "://" + host + '/' + req.file.path;

    var newEmployee = new Employee({

        // TODO adding employee Details from request;
        'name': req.body.name,
        'imageURL': imageURL,
        'salary': req.body.salary,
        'dob': parseInt(req.body.dob)
    });
    try {
        req.body.skills = JSON.parse(req.body.skills)
    } catch (e) {
        req.body.skills = [];
    }
    newEmployee.skills.push(...req.body.skills);

    newEmployee.save(function AddingEmployeeCB(err) {
        if (err) {
            console.log(err);
            fs.unlink(imageURL, function imageUnlink() {
                return res.send({
                    valid: 0,
                    comment: "Cannot Add Employee"
                });
            });
        } else
            res.json({
                valid: 1,
                comment: "New Emplyee added"
            });
    })
}

empl.update = function (req, res, next) {

    if (!req.body.id) {
        return res.json({
            valid: 0,
            comment: "No id sent"
        });
    }

    util.log("Inside Update fn");
    updateObj = {};

    if (req.file) {
        const host = req.host;
        const imageURL = req.protocol + "://" + host + '/' + req.file.path;
        updateObj.imageURL = imageURL;
        util.log("Image Updated");
    }

    if (req.body.name)
        updateObj.name = req.body.name
    if (req.body.salary)
        updateObj.salary = req.body.salary;
    if (req.body.dob)
        updateObj.dob = parseInt(req.body.dob);

    if (req.body.skills && req.body.skills.length) {
        try {
            req.body.skills = JSON.parse(req.body.skills)
        } catch (e) {
            req.body.skills = [];
        }
        updateObj.skills = req.body.skills;
    }

    if (_.isEmpty(updateObj))
        return res.json({
            valid: 0,
            comment: "Nothing to Update"
        });

    Employee.findOneAndUpdate({
        id: req.body.id
    }, updateObj, function (err, result) {
        if (err) {
            console.log(err);
            fs.unlink(imageURL, function imageUnlink() {
                return res.send({
                    valid: 0,
                    comment: "Cannot Update Employee"
                });
            });
        } else
            res.json({
                valid: 1,
                comment: "Emplyee Updated"
            });
    })
}

empl.normalizeRequest = function (req, res, next) {
    var page = parseInt(req.query.page) || 1;
    var size = parseInt(req.query.size) || 10;
    var query = {}

    query.skip = size * (page - 1)
    query.limit = size
    req.paginationObject = query;
    next();
}

empl.getEmployeeDetails = function (req, res, next) {
    var query = req.searchObject || {};
    var paginationObject = req.paginationObject || {
        skip: 0,
        limit: 10
    }
    util.log("query is +" + JSON.stringify(paginationObject));
    Employee.find(query, {}, paginationObject, function findEmployeeCB(err, result) {
        if (err) {
            return res.json({
                valid: 0,
                comment: "Something went Wrong",
                err: err
            });
        }
        res.render('list.ejs', {
            list: result
        });
    })
}

empl.deleteEmployee = function (req, res, next) {
    if (!req.body.id) {
        return res.json({
            valid: 0,
            comment: "Cannot delete without ID"
        });
    }
    Employee.findOneAndRemove({
        id: req.body.id
    }, function removeCB(err, result) {
        if (err) {
            return res.json({
                valid: 0,
                comment: "Remove not successful"
            });
        } else
            return res.json({
                valid: 1,
                comment: result
            });
    });

}

empl.search = function search(req, res, next) {
    var key = req.query.key;
    Employee.find({
        $or: [{
            'name': new RegExp(key, 'i')
        }, {
            'skills': new RegExp(key, 'i')
        }]
    }, function (err, result) {
        if(!err)
        return res.render('list.ejs', {
            list: result
        });
        else {
            util.log("Some Error occured in Search" + err);
            return res.redirect('/');
        }
    })
}

module.exports = empl;