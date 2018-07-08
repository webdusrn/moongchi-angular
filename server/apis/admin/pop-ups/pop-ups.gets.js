var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function(){
    return function(req, res, next){
        var COMMON = req.meta.std.common;
        var POP_UP = req.meta.std.popUp;

        if (req.query.orderBy === undefined) req.query.orderBy = POP_UP.defaultOrderBy;
        if (req.query.sort === undefined) req.query.sort = COMMON.DESC;
        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;

        if (req.query.searchField !== undefined) req.check("searchField", "400_3").isEnum(POP_UP.enumSearchFields);
        if (req.query.searchItem !== undefined) req.check("searchItem", "400_8").len(COMMON.minLength, COMMON.maxLength);
        if (req.query.orderBy !== undefined) req.check("orderBy", "400_3").isEnum(POP_UP.enumOrderBys);
        if (req.query.sort !== undefined) req.check("sort", "400_3").isEnum(COMMON.enumSortTypes);
        if (req.query.size !== undefined) req.check("size", "400_5").isInt({
            min: 1,
            max: COMMON.loadingMaxLength
        });
        if (req.query.last !== undefined) req.check("last", "400_18").isMicroTimestamp();
        if (req.query.offset !== undefined) req.check("offset", "400_5").isInt();
        if (req.query.isView !== undefined) {
            req.check("isView", "400_20").isBoolean();
            req.sanitize("isView").toBoolean();
        }
        req.utils.common.checkError(req, res, next);
    };
};

gets.setParam = function() {
    return function(req, res, next) {
        req.models.AppPopUp.findPopUpsByOptions(req.query, function (status, data) {
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