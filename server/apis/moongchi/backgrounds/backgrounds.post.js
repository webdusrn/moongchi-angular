var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var BACKGROUND = req.meta.std.background;
        req.check("imageId", "400_12").isInt();
        if (req.body.isUse !== undefined) {
            req.check("isUse", "400_20").isBoolean();
            req.sanitize("isUse").toBoolean();
        }
        if (req.body.type !== undefined) req.check("type", "400_3").isEnum(BACKGROUND.enumTypes);
        req.utils.common.checkError(req, res, next);
    };
};

post.setParam = function () {
    return function (req, res, next) {
        var instance = req.models.AppBackground.build(req.body);
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
