var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function(){
    return function(req, res, next){
        var PET = req.meta.std.pet;
        var COMMON = req.meta.std.common;
        var MAGIC = req.meta.std.magic;

        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;
        if (req.query.sort === undefined) req.query.sort = COMMON.ASC;
        if (req.query.orderBy === undefined) req.query.orderBy = PET.defaultOrderBy;

        if (req.query.searchField !== undefined) req.check('searchField', '400_3').isEnum(PET.enumSearchFields);
        if (req.query.searchItem !== undefined) req.check('searchItem', '400_8').len(COMMON.minLength, COMMON.maxLength);
        if (req.query.orderBy !== undefined) req.check('orderBy', '400_3').isEnum(PET.enumOrderBys);
        if (req.query.sort !== undefined) req.check('sort', '400_3').isEnum(COMMON.enumSortTypes);
        if (req.query.size !== undefined) req.check('size', '400_5').isInt({
            min: 0,
            max: COMMON.loadingMaxLength
        });
        if (req.query.offset !== undefined) req.check('offset', '400_5').isInt({
            min: 0
        });

        if (req.query.petGender !== undefined) req.check('petGender', '400_3').isEnum(PET.enumPetGenders);
        if (req.query.petSeries !== undefined) req.check('petSeries', '400_3').isEnum([MAGIC.empty].concat(PET.enumCatSeries));
        if (req.query.vaccination !== undefined) req.check('vaccination', '400_5').isInt();
        if (req.query.neuter !== undefined) {
            req.check('neuter', '400_20').isBoolean();
            req.sanitize('neuter').toBoolean();
        }

        req.utils.common.checkError(req, res, next);
    };
};

gets.setParam = function() {
    return function(req, res, next) {
        req.models.AppPet.findPetsByUser(req.query, req.user, function (status, data) {
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
