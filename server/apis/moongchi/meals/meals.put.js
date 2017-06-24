var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        req.check('id', '400_12').isInt();
        if (req.body.mealName !== undefined) req.check("mealName", "400_8").len(COMMON.minLength, COMMON.maxLength);
        if (req.body.mealStartDate !== undefined) req.check("mealStartDate", "400_18").isDate();
        if (!Object.keys(req.body).length) {
            return res.hjson(req, next, 204);
        }
        req.utils.common.checkError(req, res, next);
    };
};

put.setParam = function () {
    return function (req, res, next) {
        req.models.AppMeal.updateMealById(req.params.id, req.body, req.user, function (status, data) {
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
