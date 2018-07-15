var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {

        req.check('petId', '400_12').isInt();
        req.check('imageId', '400_12').isInt();

        req.utils.common.checkError(req, res, next);
    };
};

post.checkAuthorization = function () {
    return function (req, res, next) {
        req.models.AppUserPet.checkAuthorization(req.user, req.body.petId, function (status, data) {
            if (status == 204) {
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.setParam = function () {
    return function (req, res, next) {
        var instance = req.models.AppPetImage.build(req.body);

        instance.create(function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 201, req.data);
    };
};

module.exports = post;
