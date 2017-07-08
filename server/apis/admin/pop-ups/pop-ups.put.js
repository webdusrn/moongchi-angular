var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        req.check('id', '400_12').isInt();
        if (req.body.title !== undefined) req.check("title", "400_8").len(COMMON.minLength, COMMON.maxLength);
        if (req.body.imageId !== undefined) req.check("imageId", "400_12").isInt();
        if (req.body.isView !== undefined) {
            req.check("isView", "400_20").isBoolean();
            req.sanitize("isView").toBoolean();
        }
        if (!Object.keys(req.body).length) {
            return res.hjson(req, next, 204);
        }
        req.utils.common.checkError(req, res, next);
    };
};

put.setParam = function () {
    return function (req, res, next) {
        req.models.AppPopUp.updateDataById(req.params.id, req.body, function (status, data) {
            if (status == 204) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = put;
