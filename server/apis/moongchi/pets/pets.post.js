var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var dateExp = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');

post.validate = function () {
    return function (req, res, next) {
        var PET = req.meta.std.pet;
        var COMMON = req.meta.std.common;

        req.check('petName', '400_8').len(COMMON.minLength, COMMON.maxLength);

        if (req.body.petType !== undefined) req.check('petType', '400_3').isEnum(PET.enumPetTypes);
        if (req.body.petSeries !== undefined) req.check('petSeries', '400_8').len(COMMON.minLength, COMMON.maxLength);
        if (req.body.petGender !== undefined) req.check('petGender', '400_3').isEnum(PET.enumPetGenders);
        if (req.body.birthAt !== undefined) req.check('birthAt', '400_18').isExp(dateExp);

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

        req.utils.common.checkError(req, res, next);
    };
};

post.dateValidate = function () {
    return function (req, res, next) {
        var date = req.body.birthAt;
        if (date !== undefined) {
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

post.setParam = function () {
    return function (req, res, next) {
        req.body.userPets = [{
            userId: req.user.id
        }];

        var treatmentGroups = null;
        if (req.body.isVaccination1 || req.body.isVaccination2 || req.body.isVaccination3 || req.body.isNeuter) {
            var TREATMENT = req.meta.std.treatment;
            treatmentGroups = [];
            for (var i=1; i<=3; i++) {
                if (req.body['isVaccination' + i]) {
                    treatmentGroups.push({
                        treatments: [{
                            treatmentType: TREATMENT['treatmentTypeVaccination' + i]
                        }]
                    });
                }
            }
            if (req.body.isNeuter) {
                treatmentGroups.push({
                    treatments: [{
                        treatmentType: TREATMENT.treatmentTypeNeuter
                    }]
                });
            }
        }
        delete req.body.isVaccination1;
        delete req.body.isVaccination2;
        delete req.body.isVaccination3;
        delete req.body.isNeuter;

        req.models.AppPet.createPetByUser(req.body, treatmentGroups, function (status, data) {
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
