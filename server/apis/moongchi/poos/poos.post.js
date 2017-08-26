var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var POO = req.meta.std.poo;
        req.check("petId", "400_12").isInt();
        req.check("pooType", "400_3").isEnum(POO.enumPooTypes);
        req.check("pooColor", "400_3").isEnum(POO.enumPooColors);
        req.check("pooDate", "400_18").isDate();
        req.utils.common.checkError(req, res, next);
    };
};

post.setParam = function () {
    return function (req, res, next) {
        req.models.AppPoo.createPoo(req.body, function (status, data) {
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
