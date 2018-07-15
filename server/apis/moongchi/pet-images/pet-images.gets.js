var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function(){
    return function(req, res, next){
        var PET_IMAGE = req.meta.std.petImage;
        var COMMON = req.meta.std.common;

        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;
        if (req.query.orderBy === undefined) req.query.orderBy = PET_IMAGE.defaultOrderBy;
        if (req.query.sort === undefined) req.query.sort = COMMON.DESC;

        if (req.query.orderBy !== undefined) req.check('orderBy', '400_3').isEnum(PET_IMAGE.enumOrderBys);
        if (req.query.size !== undefined) req.check('size', '400_5').isInt({
            min: 0,
            max: COMMON.loadingMaxLength
        });
        if (req.query.offset !== undefined) req.check('offset', '400_5').isInt({
            min: 0
        });
        if (req.query.petId !== undefined) req.check('petId', '400_12').isInt();

        req.utils.common.checkError(req, res, next);
    };
};

gets.setParam = function() {
    return function(req, res, next) {
        req.models.AppPetImage.findPetImagesByUser(req.query, req.user, function (status, data) {
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
