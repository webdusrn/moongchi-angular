var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        var TREATMENT = req.meta.std.treatment;

        req.check('treatmentGroupId', '400_12').isInt();
        req.check('petId', '400_12').isInt();
        req.check('treatmentType', '400_3').isEnum(TREATMENT.enumTreatmentTypes);
        if (req.body.treatmentPrice !== undefined) req.check('treatmentPrice', '400_5').isInt();

        req.utils.common.checkError(req, res, next);
    };
};

post.checkAuthorization = function () {
    return function (req, res, next) {
        req.models.AppUserPet.checkAuthorization(req.user, req.body.petId, function (status, data) {
            if (status == 204) {
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.setParam = function () {
    return function (req, res, next) {
        var include = [{
            model: req.models.AppPet,
            as: 'pet',
            include: [{
                model: req.models.Image,
                as: 'image'
            }]
        }];
        req.models.AppTreatment.createDataIncluding(req.body, include, function (status, data) {
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
