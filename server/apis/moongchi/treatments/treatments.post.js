var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        var TREATMENT = req.meta.std.treatment;
        if (req.body.treatmentType !== undefined) req.check("treatmentType", "400_3").isEnum(TREATMENT.enumTreatmentTypes);
        req.check("treatmentTitle", "400_8").len(COMMON.minLength, COMMON.maxLength);
        req.check("treatmentDate", "400_18").isDate();
        if (req.body.hospitalName !== undefined) req.check("hospitalName", "400_8").len(COMMON.minLength, COMMON.maxLength);
        if (req.body.petIds !== undefined) {
            req.utils.common.toArray(req.body, "petIds");
        }
        if (req.body.chargeObject !== undefined) {
            req.charge = JSON.parse(req.body.chargeObject);
            req.charge.authorId = req.user.id;
            delete req.body.chargeObject;
        }
        req.utils.common.checkError(req, res, next);
    };
};

post.setParam = function () {
    return function (req, res, next) {
        req.body.authorId = req.user.id;
        if (req.body.petIds !== undefined) {
            req.body.petTreatments = [];
            req.body.petIds.forEach(function (petId) {
                req.body.petTreatments.push({
                    petId: petId
                });
            });
            delete req.body.petIds;
        }

        req.models.AppTreatment.createTreatment(req.body, req.charge, function (status, data) {
            if (status == 201) {
                data.reload().then(function (data) {
                    req.data = data;
                    next();
                });
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
