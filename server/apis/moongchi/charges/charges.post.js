var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        req.check("chargeTitle", "400_8").len(COMMON.minLength, COMMON.maxLength);
        if (req.body.chargeContent !== undefined) req.check("chargeContent", "400_8").len(COMMON.minLength, COMMON.maxLength);
        req.check("chargeDate", "400_18").isDate();
        req.check("charge", "400_5").isInt();
        req.utils.common.checkError(req, res, next);
    };
};

post.setParam = function () {
    return function (req, res, next) {
        var instance = req.models.AppCharge.build(req.body);
        req.body.authorId = req.user.id;
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
