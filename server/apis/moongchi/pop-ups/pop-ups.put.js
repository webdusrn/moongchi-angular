var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();
        req.utils.common.checkError(req, res, next);
    };
};

put.setParam = function () {
    return function (req, res, next) {
        req.models.AppUserPopUp.upsertUserPopUp(req.params.id, req.user.id, function (status, data) {
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
