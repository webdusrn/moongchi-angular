var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        req.check("title", "400_8").len(COMMON.minLength, COMMON.maxLength);
        req.check("imageId", "400_12").isInt();
        if (req.body.isView !== undefined) {
            req.check("isView", "400_20").isBoolean();
            req.sanitize("isView").toBoolean();
        }
        req.utils.common.checkError(req, res, next);
    };
};

post.setParam = function () {
    return function (req, res, next) {
        var include = req.models.AppPopUp.getIncludePopUp();
        req.models.AppPopUp.createDataIncluding(req.body, include, function (status, data) {
            if (status == 201) {
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
