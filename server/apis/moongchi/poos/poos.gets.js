var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function(){
    return function(req, res, next){
        var COMMON = req.meta.std.common;
        var POO = req.meta.std.poo;

        if (req.query.orderBy === undefined) req.query.orderBy = POO.defaultOrderBy;
        if (req.query.sort === undefined) req.query.sort = COMMON.DESC;
        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;

        if (req.query.orderBy !== undefined) req.check("orderBy", "400_3").isEnum(POO.enumOrderBys);
        if (req.query.sort !== undefined) req.check("sort", "400_3").isEnum(COMMON.enumSortTypes);
        if (req.query.last !== undefined) req.check("last", "400_18").isMicroTimestamp();
        if (req.query.size !== undefined) req.check("size", "400_5").isInt({
            min: 1,
            max: COMMON.loadingMaxLength
        });
        if (req.query.petId !== undefined) req.check("petId", "400_12").isInt();
        if (req.query.pooType !== undefined) req.check("pooType", "400_3").isEnum(POO.enumPooTypes);
        if (req.query.pooColor !== undefined) req.check("pooColor", "400_3").isEnum(POO.enumPooColors);
        if (req.query.pooYear !== undefined || req.query.pooMonth !== undefined) {
            if (req.query.pooYear === undefined || req.query.pooMonth === undefined) {
                return res.hjson(req, next, 400, {
                    code: "400_14"
                });
            }
            req.check("pooYear", "400_5").isInt();
            req.check("pooMonth", "400_5").isInt();
        }
        req.utils.common.checkError(req, res, next);
    };
};

gets.normalizePooDate = function () {
    return function (req, res, next) {
        if (req.query.pooYear !== undefined) {
            if (req.query.pooMonth == 12) {
                req.query.pooEndYear = req.query.pooYear + 1;
                req.query.pooEndMonth = '01';
            } else {
                req.query.pooEndYear = req.query.pooYear;
                req.query.pooEndMonth = req.query.pooMonth + 1;
            }

            if (req.query.pooMonth < 10) {
                req.query.pooMonth = '0' + req.query.pooMonth;
            }

            if (req.query.pooEndMonth < 10) {
                req.query.pooEndMonth = '0' + req.query.pooEndMonth;
            }

            req.query.startPooDate = new Date(req.query.pooYear + '-' + req.query.pooMonth + '-01').getTime() - 1;
            req.query.endPooDate = new Date(req.query.pooEndYear + '-' + req.query.pooEndMonth + '-01').getTime();
        }

        next();
    };
};

gets.setParam = function() {
    return function(req, res, next) {
        req.models.AppPoo.findPoosByOptions(req.query, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        })
    };
};

gets.supplement = function(){
    return function(req, res, next){
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
