var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var dateExp = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');

put.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        var MAGIC = req.meta.std.magic;

        req.check('id', '400_12').isInt();

        if (req.body.hospitalName !== undefined && req.body.hospitalName !== MAGIC.reset) req.check('hospitalName', '400_8').len(COMMON.minLength, COMMON.maxLength);
        if (req.body.treatmentTotalPrice !== undefined && req.body.treatmentTotalPrice !== MAGIC.reset) req.check('treatmentTotalPrice', '400_5').isInt({
            min: 0
        });
        if (req.body.treatmentAt !== undefined && req.body.treatmentAt !== MAGIC.reset) req.check('treatmentAt', '400_18').isExp(dateExp);

        if (Object.keys(req.body).length == 0) {
            return res.hjson(req, next, 204);
        }

        req.utils.common.checkError(req, res, next);
    };
};

put.dateValidate = function () {
    return function (req, res, next) {
        var MAGIC = req.meta.std.magic;

        var date = req.body.treatmentAt;
        if (date !== undefined && date !== MAGIC.reset) {
            date = new Date(date + ' 00:00:00');
            if (isNaN(date.getTime())) {
                return res.hjson(req, next, 400, {
                    field: 'treatmentAt',
                    code: "400_18"
                });
            } else {
                req.body.treatmentAt = date;
                next();
            }
        } else {
            next();
        }
    };
};

put.checkAuthorization = function () {
    return function (req, res, next) {
        req.models.AppTreatmentGroup.checkAuthorizationByUser(req.params.id, req.user, function (status, data) {
            if (status == 204) {
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

put.setParam = function () {
    return function (req, res, next) {
        var MAGIC = req.meta.std.magic;

        for (var k in req.body) {
            if (req.body[k] == MAGIC.reset) {
                req.body[k] = null;
            }
        }

        req.models.AppTreatmentGroup.updateDataById(req.params.id, req.body, function (status, data) {
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
