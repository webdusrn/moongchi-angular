var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function(){
    return function(req, res, next){
        var COMMON = req.meta.std.common;
        var PET = req.meta.std.poo;

        if (req.query.orderBy === undefined) req.query.orderBy = PET.defaultOrderBy;
        if (req.query.sort === undefined) req.query.sort = COMMON.DESC;
        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;

        if (req.query.orderBy !== undefined) req.check("orderBy", "400_3").isEnum(PET.enumOrderBys);
        if (req.query.sort !== undefined) req.check("sort", "400_3").isEnum(COMMON.enumSortTypes);
        if (req.query.last !== undefined) req.check("last", "400_18").isMicroTimestamp();
        if (req.query.size !== undefined) req.check("size", "400_5").isInt({
            min: 1,
            max: COMMON.loadingMaxLength
        });
        if (req.query.offset !== undefined) req.check("offset", "400_5").isInt({
            min: 0
        });
        req.utils.common.checkError(req, res, next);
    };
};

gets.setParam = function() {
    return function(req, res, next) {
        req.query.userId = req.user.id;
        req.models.AppPet.findPetPoosByOptions(req.query, function (status, data) {
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
        for (var i=0; i<req.data.rows.length; i++) {
            delete req.data.rows[i].dataValues.userPets;
        }
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
