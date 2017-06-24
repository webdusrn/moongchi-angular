var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        req.check("mealName", "400_8").len(COMMON.minLength, COMMON.maxLength);
        req.check("mealStartDate", "400_18").isDate();
        if (req.body.petIds !== undefined) {
            req.utils.common.toArray(req.body, "petIds");
        }
        if (req.body.chargeObject) {
            req.charge = JSON.parse(req.body.chargeObject);
            req.charge.authorId = req.user.id;
            delete req.body.chargeObject;
        }
        req.utils.common.checkError(req, res, next);
    };
};

post.setParam = function () {
    return function (req, res, next) {
        req.body.authorId = req.user.id;
        if (req.body.petIds !== undefined) {
            req.body.petMeals = [];
            req.body.petIds.forEach(function (petId) {
                req.body.petMeals.push({
                    petId: petId
                });
            });
            delete req.body.petIds;
        }

        req.models.AppMeal.createMeal(req.body, req.charge, function (status, data) {
            if (status == 201) {
                data.reload().then(function (data) {
                    req.data = data;
                    next();
                });
            } else {
                return res.hjson(req, next, status, data);
            }
        })
    };
};

post.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 201, req.data);
    };
};

module.exports = post;
