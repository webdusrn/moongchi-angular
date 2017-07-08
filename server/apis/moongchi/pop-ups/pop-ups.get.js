var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {

        req.utils.common.checkError(req, res, next);
    };
};

get.setParam = function () {
    return function (req, res, next) {
        req.models.AppPopUp.findCurrentPopUp(req.user, function (status, data) {
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
        delete req.data.dataValues.userPopUps;
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = get;
