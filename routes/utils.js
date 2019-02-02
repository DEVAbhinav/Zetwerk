var multer = require('multer');


var utils = {};


utils.upload = function upload() {


    var Storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, "./Images");
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    });

    var uploadFn = multer({
        storage: Storage
    }).single('image');

    return uploadFn;
}