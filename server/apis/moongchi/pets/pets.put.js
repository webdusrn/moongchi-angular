var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

put.validate = function () {
    return function (req, res, next) {
        var MAGIC = req.meta.std.magic;
        var COMMON = req.meta.std.common;
        var PET = req.meta.std.pet;
        req.check('id', '400_12').isInt();
        if (req.body.petName !== undefined) req.check("petName", "400_8").len(COMMON.minLength, COMMON.maxLength);
        if (req.body.petSeries !== undefined && req.body.petSeries !== MAGIC.reset) req.check("petSeries", "400_3").isEnum(PET.enumCatSeries);
        if (req.body.petType !== undefined) req.check("petType", "400_3").isEnum(PET.enumPetTypes);
        if (req.body.petGender !== undefined) req.check("petGender", "400_3").isEnum(PET.enumPetGenders);
        if (req.body.petBirthDate !== undefined) req.check("petBirthDate", "400_18").isDate();
        if (req.body.imageId !== undefined && req.body.imageId !== MAGIC.reset) req.check("imageId", "400_12").isInt();
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

        req.models.AppPet.updatePetById(req.params.id, req.body, req.user, function (status, data) {
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
