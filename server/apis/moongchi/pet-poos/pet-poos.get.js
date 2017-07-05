var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();
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
