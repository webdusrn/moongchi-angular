var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;
        var PET = req.meta.std.pet;
        req.check("petName", "400_8").len(COMMON.minLength, COMMON.maxLength);
        if (req.body.petSeries !== undefined) req.check("petSeries", "400_3").isEnum(PET.enumCatSeries);
        if (req.body.petType !== undefined) req.check("petType", "400_3").isEnum(PET.enumPetTypes);
        req.check("petGender", "400_3").isEnum(PET.enumPetGenders);
        req.check("petBirthDate", "400_18").isDate();
        if (req.body.imageId !== undefined) req.check("imageId", "400_12").isInt();
        req.utils.common.checkError(req, res, next);
    };
};

post.setParam = function () {
    return function (req, res, next) {
        var include = [{
            model: req.models.AppUserPet,
            as: "userPets"
        }];
        req.body.userPets = [{
            userId: req.user.id
        }];
        req.models.AppPet.createDataIncluding(req.body, include, function (status, data) {
            if (status == 201) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.supplement = function () {
    return function (req, res, next) {
        delete req.data.dataValues.userPets;
        res.hjson(req, next, 201, req.data);
    };
};

module.exports = post;
