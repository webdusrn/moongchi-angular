var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();
        if (req.query.year !== undefined || req.query.month !== undefined) {
            if (req.query.year !== undefined) {
                req.check("year", "400_5").isInt();
            } else {
                return res.hjson(req, next, 400, {
                    code: "400_14"
                });
            }
            if (req.query.month !== undefined) {
                req.check("month", "400_5").isInt();
            } else {
                return res.hjson(req, next, 400, {
                    code: "400_14"
                });
            }
        }
        req.utils.common.checkError(req, res, next);
    };
};

get.setParam = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        var POO = req.meta.std.poo;
        var include = [{
            model: req.models.AppUserPet,
            as: "userPets",
            where: {
                userId: req.user.id
            },
            required: true
        }, {
            model: req.models.AppPoo,
            as: "poos",
            order: [[POO.orderByPooDate, COMMON.DESC]],
            limit: COMMON.defaultLoadingLength
        }];

        if (req.query.year !== undefined) {
            var attachZero = req.coreUtils.common.attachZero;
            var startDate = new Date(req.query.year + '-' + attachZero(req.query.month) + '-01 00:00:00').getTime() - 1;
            var endYear = req.query.year;
            var endMonth = parseInt(req.query.month) + 1;
            if (endMonth > 12) {
                endYear = parseInt(endYear) + 1;
                endMonth = 1;
            }
            var endDate = new Date(endYear + '-' + attachZero(endMonth) + '-01 00:00:00').getTime();
            include[1].where = {
                $and: [{
                    pooDate: {
                        "$gt": startDate
                    }
                }, {
                    pooDate: {
                        "$lt": endDate
                    }
                }]
            };
            include[1].required = false;
        }

        req.models.AppPet.findDataIncludingById(req.params.id, include, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

get.supplement = function () {
    return function (req, res, next) {
        delete req.data.dataValues.userPets;
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = get;
