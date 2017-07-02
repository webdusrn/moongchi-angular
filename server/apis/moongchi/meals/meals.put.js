var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var MAGIC = req.meta.std.magic;
        var COMMON = req.meta.std.common;
        req.check('id', '400_12').isInt();
        if (req.body.mealName !== undefined) req.check("mealName", "400_8").len(COMMON.minLength, COMMON.maxLength);
        if (req.body.mealStartDate !== undefined) req.check("mealStartDate", "400_18").isDate();
        if (!Object.keys(req.body).length) {
            return res.hjson(req, next, 204);
        }
        if (req.body.chargeObject) {
            req.charge = JSON.parse(req.body.chargeObject);
            req.charge.authorId = req.user.id;
            delete req.body.chargeObject;
        }
        if (req.body.petIds !== undefined) {
            if (req.body.petIds !== MAGIC.reset) {
                req.utils.common.toArray(req.body, "petIds");
                req.petIds = [];
                req.body.petIds.forEach(function (petId) {
                    req.petIds.push({
                        petId: petId,
                        mealId: req.params.id
                    });
                });
            } else {
                req.petIds = null;
            }
            delete req.body.petIds;
        }
        req.utils.common.checkError(req, res, next);
    };
};

put.setParam = function () {
    return function (req, res, next) {
        req.models.AppMeal.updateMealById(req.params.id, req.body, req.user, req.charge, req.petIds, function (status, data) {
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
