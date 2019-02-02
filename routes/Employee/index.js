var error = require('../error');
var multer = require('multer');
var e = require('./employee');
var utils = require('../utils');
var employee = require("../../models/employee");
var upload = multer({
    dest: 'Images/'
})







module.exports = function EmployeeMapper(app) {
    app.get('/employee', e.normalizeRequest, e.getEmployeeDetails);
    app.post('/editEmployee', upload.single('image'), e.update );
    app.post('/employee', upload.single('image'), e.validateRequest, e.add);
    app.post('/deleteEmployee', e.deleteEmployee);
    app.get('/search', e.search);
};