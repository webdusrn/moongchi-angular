var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

post.validate = function () {
    return function (req, res, next) {
        req.check("petId", "400_12").isInt();
        req.utils.common.toArray(req.body, "imageIds");
        req.utils.common.checkError(req, res, next);
    };
};

post.hasAuthorization = function () {
    return function (req, res, next) {
        if (req.user.role < req.meta.std.user.roleAdmin) {
            req.models.AppUserPet.findDataWithQuery({
                where: {
                    petId: req.body.petId,
                    userId: req.user.id
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

post.setParam = function () {
    return function (req, res, next) {
        req.models.AppPetImage.createPetImages(req.body.petId, req.body.imageIds, function (status, data) {
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
        res.hjson(req, next, 201, req.data);
    };
};

module.exports = post;
