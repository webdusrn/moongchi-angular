var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function(){
    return function(req, res, next){
        var TREATMENT_GROUP = req.meta.std.treatmentGroup;
        var TREATMENT = req.meta.std.treatment;
        var COMMON = req.meta.std.common;

        if (req.query.size === undefined) req.query.size = COMMON.defaultLoadingLength;
        if (req.query.orderBy === undefined) req.query.orderBy = TREATMENT_GROUP.defaultOrderBy;
        if (req.query.sort === undefined) req.query.sort = COMMON.DESC;

        if (req.query.orderBy !== undefined) req.check('orderBy', '400_3').isEnum(TREATMENT_GROUP.enumOrderBys);
        if (req.query.size !== undefined) req.check('size', '400_5').isInt({
            min: 0,
            max: COMMON.loadingMaxLength
        });
        if (req.query.offset !== undefined) req.check('offset', '400_5').isInt({
            min: 0
        });
        if (req.query.searchField !== undefined) req.check('searchField', '400_3').isEnum(TREATMENT_GROUP.enumSearchFields);
        if (req.query.searchItem !== undefined) req.check('searchItem', '400_8').len(COMMON.minLength, COMMON.maxLength);
        if (req.query.treatmentType !== undefined) req.check('treatmentType', '400_3').isEnum(TREATMENT.enumTreatmentTypes);
        if (req.query.petId !== undefined) req.check('petId', '400_12').isInt();

        req.utils.common.checkError(req, res, next);
    };
};

gets.setParam = function() {
    return function(req, res, next) {
        req.models.AppTreatmentGroup.findTreatmentGroupsByUser(req.query, req.user, function (status, data) {
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
