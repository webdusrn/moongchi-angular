var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

del.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();
        req.utils.common.checkError(req, res, next);
    };
};

del.hasAuthorization = function () {
    return function (req, res, next) {
        if (req.user.role < req.meta.std.user.roleAdmin) {
            req.models.AppPetImage.findDataWithQuery({
                include: [{
                    model: req.models.AppPet,
                    as: "pet",
                    require: true,
                    include: [{
                        model: req.models.AppUserPet,
                        as: "userPets",
                        where: {
                            userId: req.user.id
                        },
                        required: true
                    }]
                }],
                where: {
                    id: req.params.id
                }
            }, function (status, data) {
                if (status == 200) {
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

del.destroy = function () {
    return function (req, res, next) {
        req.models.AppPetImage.deletePetImageById(req.params.id, function (status, data) {
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
