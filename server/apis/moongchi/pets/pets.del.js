var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();
        req.utils.common.checkError(req, res, next);
    };
};

del.checkAuthorization = function () {
    return function (req, res, next) {
        req.models.AppUserPet.checkAuthorization(req.user, req.params.id, function (status, data) {
            if (status == 204) {
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

del.destroy = function () {
    return function (req, res, next) {
        req.models.AppPet.deletePetByUser(req.params.id, req.user, function (status, data) {
            if (status == 204) {
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

del.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = del;
