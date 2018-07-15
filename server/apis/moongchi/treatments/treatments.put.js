var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var TREATMENT = req.meta.std.treatment;
        var MAGIC = req.meta.std.magic;

        if (req.body.petId !== undefined) req.check('petId', '400_12').isInt();
        if (req.body.treatmentType !== undefined) req.check('treatmentType', '400_3').isEnum(TREATMENT.enumTreatmentTypes);
        if (req.body.treatmentPrice !== undefined && req.body.treatmentPrice !== MAGIC.reset) req.check('treatmentPrice', '400_5').isInt();

        if (Object.keys(req.body).length == 0) {
            return res.hjson(req, next, 204);
        }

        req.utils.common.checkError(req, res, next);
    };
};

put.checkPetAuthorization = function () {
    return function (req, res, next) {
        if (req.body.petId !== undefined) {
            req.models.AppUserPet.checkAuthorization(req.user, req.body.petId, function (status, data) {
                if (status == 204) {
                    next();
                } else {
                    return res.hjson(req, next, status, data);
                }
            });
        } else {
            next();
        }
    };
};

put.checkAuthorization = function () {
    return function (req, res, next) {
        req.models.AppTreatment.checkAuthorizationByUser(req.params.id, req.user, function (status, data) {
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

        req.models.AppTreatment.updateDataById(req.params.id, req.body, function (status, data) {
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
