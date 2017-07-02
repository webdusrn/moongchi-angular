var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var MAGIC = req.meta.std.magic;
        var COMMON = req.meta.std.common;
        req.check('id', '400_12').isInt();
        if (req.body.chargeTitle !== undefined) req.check("chargeTitle", "400_8").len(COMMON.minLength, COMMON.maxLength);
        if (req.body.chargeContent !== undefined && req.body.chargeContent !== MAGIC.reset) req.check("chargeContent", "400_8").len(COMMON.minLength, COMMON.maxLength);
        if (req.body.chargeDate !== undefined) req.check("chargeDate", "400_18").isDate();
        if (req.body.charge !== undefined) req.check("charge", "400_5").isInt();
        if (!Object.keys(req.body).length) {
            return res.hjson(req, next, 204);
        }
        req.utils.common.checkError(req, res, next);
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

        req.models.AppCharge.updateChargeById(req.params.id, req.body, req.user, function (status, data) {
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
