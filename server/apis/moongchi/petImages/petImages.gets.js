var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function(){
    return function(req, res, next){
        var COMMON = req.meta.std.common;
        var PET_IMAGE = req.meta.std.petImage;

        if (req.query.orderBy === undefined) req.query.orderBy = PET_IMAGE.defaultOrderBy;
        if (req.query.sort === undefined) req.query.sort = COMMON.DESC;
        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;

        if (req.query.orderBy !== undefined) req.check("orderBy", "400_3").isEnum(PET_IMAGE.enumOrderBys);
        if (req.query.sort !== undefined) req.check("sort", "400_3").isEnum(COMMON.enumSortTypes);
        if (req.query.last !== undefined) req.check("last", "400_18").isMicroTimestamp();
        if (req.query.size !== undefined) req.check("size", "400_5").isInt({
            min: 1,
            max: COMMON.loadingMaxLength
        });
        if (req.query.petId !== undefined) req.check("petId", "400_12").isInt();
        req.utils.common.checkError(req, res, next);
    };
};

gets.hasAuthorization = function () {
    return function (req, res, next) {
        if (req.user.role < req.meta.std.user.roleAdmin) {
            if (req.query.petId === undefined) {
                return res.hjson(req, next, 403);
            } else {
                req.models.AppUserPet.findDataWithQuery({
                    where: {
                        petId: req.query.petId,
                        userId: req.user.id
                    }
                }, function (status, data) {
                    if (status == 200) {
                        next();
                    } else {
                        return res.hjson(req, next, status, data);
                    }
                });
            }
        } else {
            next();
        }
    };
};

gets.setParam = function() {
    return function(req, res, next) {

        req.models.AppPetImage.findPetImagesByOptions(req.query, req.user, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

gets.supplement = function(){
    return function(req, res, next){
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
