var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var dateExp = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');

put.validate = function () {
    return function (req, res, next) {
        var PET = req.meta.std.pet;
        var COMMON = req.meta.std.common;
        var MAGIC = req.meta.std.magic;

        req.check('id', '400_12').isInt();

        if (req.body.petName !== undefined) req.check('petName', '400_8').len(COMMON.minLength, COMMON.maxLength);

        if (req.body.petSeries !== undefined && req.body.petSeries !== MAGIC.reset) req.check('petSeries', '400_8').len(COMMON.minLength, COMMON.maxLength);
        if (req.body.petGender !== undefined && req.body.petGender !== MAGIC.reset) req.check('petGender', '400_3').isEnum(PET.enumPetGenders);
        if (req.body.birthAt !== undefined && req.body.birthAt !== MAGIC.reset) req.check('birthAt', '400_18').isExp(dateExp);

        if (req.body.isVaccination1 !== undefined) {
            req.check('isVaccination1', '400_20').isBoolean();
            req.sanitize('isVaccination1').toBoolean();
        }
        if (req.body.isVaccination2 !== undefined) {
            req.check('isVaccination2', '400_20').isBoolean();
            req.sanitize('isVaccination2').toBoolean();
        }
        if (req.body.isVaccination3 !== undefined) {
            req.check('isVaccination3', '400_20').isBoolean();
            req.sanitize('isVaccination3').toBoolean();
        }
        if (req.body.isNeuter !== undefined) {
            req.check('isNeuter', '400_20').isBoolean();
            req.sanitize('isNeuter').toBoolean();
        }

        if (req.body.imageId !== undefined && req.body.imageId !== MAGIC.reset) req.check('imageId', '400_12').isInt();

        req.utils.common.checkError(req, res, next);
    };
};

put.dateValidate = function () {
    return function (req, res, next) {
        var MAGIC = req.meta.std.magic;

        var date = req.body.birthAt;
        if (date !== undefined && date !== MAGIC.reset) {
            date = new Date(date + ' 00:00:00');
            if (isNaN(date.getTime())) {
                return res.hjson(req, next, 400, {
                    field: 'birthAt',
                    code: "400_18"
                });
            } else {
                req.body.birthAt = date;
                next();
            }
        } else {
            next();
        }
    };
};

put.checkAuthorization = function () {
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

put.findTreatments = function () {
    return function (req, res, next) {
        var TREATMENT = req.meta.std.treatment;
        req.models.AppTreatment.findAllDataWithQuery({
            where: {
                petId: req.params.id,
                treatmentType: [
                    TREATMENT.treatmentTypeVaccination1,
                    TREATMENT.treatmentTypeVaccination2,
                    TREATMENT.treatmentTypeVaccination3,
                    TREATMENT.treatmentTypeNeuter
                ]
            }
        }, function (status, data) {
            if (status == 200) {
                data.forEach(function (treatment) {
                    if (treatment.treatmentType == TREATMENT.treatmentTypeVaccination1) {
                        if (req.body.isVaccination1) delete req.body.isVaccination1;
                    } else if (treatment.treatmentType == TREATMENT.treatmentTypeVaccination2) {
                        if (req.body.isVaccination2) delete req.body.isVaccination2;
                    } else if (treatment.treatmentType == TREATMENT.treatmentTypeVaccination3) {
                        if (req.body.isVaccination3) delete req.body.isVaccination3;
                    } else if (treatment.treatmentType == TREATMENT.treatmentTypeNeuter) {
                        if (req.body.isNeuter) delete req.body.isNeuter;
                    }
                });
            }
            next();
        });
    };
};

put.setParam = function () {
    return function (req, res, next) {
        var MAGIC = req.meta.std.magic;
        var TREATMENT = req.meta.std.treatment;

        for (var k in req.body) {
            if (req.body[k] == MAGIC.reset) {
                req.body[k] = null;
            }
        }

        var treatmentGroups = null;
        if (req.body.isVaccination1 || req.body.isVaccination2 || req.body.isVaccination3 || req.body.isNeuter) {
            treatmentGroups = [];
            for (var i=1; i<=3; i++) {
                if (req.body['isVaccination' + i]) {
                    treatmentGroups.push({
                        treatments: [{
                            petId: req.params.id,
                            treatmentType: TREATMENT['treatmentTypeVaccination' + i]
                        }]
                    });
                }
            }
            if (req.body.isNeuter) {
                treatmentGroups.push({
                    treatments: [{
                        petId: req.params.id,
                        treatmentType: TREATMENT.treatmentTypeNeuter
                    }]
                });
            }
        }

        var deleteTreatmentTypes = null;
        if (req.body.isVaccination1 === false || req.body.isVaccination2 === false || req.body.isVaccination3 === false || req.body.isNeuter === false) {
            deleteTreatmentTypes = [];
            for (var i=1; i<=3; i++) {
                if (req.body['isVaccination' + i] === false) {
                    deleteTreatmentTypes.push(TREATMENT['treatmentTypeVaccination' + i]);
                }
            }
            if (req.body.isNeuter === false) {
                deleteTreatmentTypes.push(TREATMENT.treatmentTypeNeuter);
            }
        }

        delete req.body.isVaccination1;
        delete req.body.isVaccination2;
        delete req.body.isVaccination3;
        delete req.body.isNeuter;

        req.models.AppPet.updatePetByUser(req.params.id, req.body, treatmentGroups, deleteTreatmentTypes, function (status, data) {
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
