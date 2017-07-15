var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var BACKGROUND = req.meta.std.background;
        req.check('id', '400_12').isInt();

        if (req.body.imageId !== undefined) req.check("imageId", "400_12").isInt();
        if (req.body.type !== undefined) req.check("type", "400_3").isEnum(BACKGROUND.enumTypes);
        if (req.body.isUse !== undefined) {
            req.check("isUse", "400_20").isBoolean();
            req.sanitize("isUse").toBoolean();
        }
        if (!Object.keys(req.body).length) {
            return res.hjson(req, next, 204);
        }
        req.utils.common.checkError(req, res, next);
    };
};

put.setParam = function () {
    return function (req, res, next) {
        req.models.AppBackground.updateDataById(req.params.id, req.body, function (status, data) {
            if (status == 204) {
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
