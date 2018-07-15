var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var dateExp = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');

post.validate = function () {
    return function (req, res, next) {
        var COMMON = req.meta.std.common;

        if (req.body.hospitalName !== undefined) req.check('hospitalName', '400_8').len(COMMON.minLength, COMMON.maxLength);
        if (req.body.treatmentAt !== undefined) req.check('treatmentAt', '400_18').isExp(dateExp);
        if (req.body.treatmentTotalPrice !== undefined) req.check('treatmentTotalPrice', '400_5').isInt({
            min: 0
        });

        req.utils.common.toArray(req.body, 'petIds');
        req.utils.common.toArray(req.body, 'treatmentTypes');
        req.utils.common.toArray(req.body, 'treatmentPrices');
        req.utils.common.toArray(req.body, 'treatmentMemos');

        var treatmentLength = req.bodt.petIds.length;

        if (req.body.treatmentTypes.length != treatmentLength ||
            req.body.treatmentPrices.length != treatmentLength ||
            req.body.treatmentMemos.length != treatmentLength) {
            return res.hjson(req, next, 400, {
                code: "400_14"
            });
        }

        req.utils.common.checkError(req, res, next);
    };
};

post.validateDate = function () {
    return function (req, res, next) {
        var date = req.body.treatmentAt;
        if (date !== undefined) {
            date = new Date(date + ' 00:00:00');
            if (isNaN(date.getTime())) {
                return res.hjson(req, next, 400, {
                    field: 'treatmentAt',
                    code: "400_18"
                });
            } else {
                req.body.treatmentAt = date;
                next();
            }
        } else {
            next();
        }
    };
};

post.checkAuthorization = function () {
    return function (req, res, next) {
        req.models.AppUserPet.checkAuthorization(req.user, req.body.petIds, function (status, data) {
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
        var MAGIC = req.meta.std.magic;
        req.body.treatments = [];
        req.body.petIds.forEach(function (petId, index) {
            req.body.treatments.push({
                petId: petId,
                treatmentType: req.body.treatmentTypes[index],
                treatmentPrice: req.body.treatmentPrices[index] !== MAGIC.reset ? req.body.treatmentPrices[index] : null,
                treatmentMemo: req.body.treatmentMemos[index] !== MAGIC.reset ? req.body.treatmentMemos[index] : null
            });
        });

        var petIds = req.body.petIds.slice();

        delete req.body.petIds;
        delete req.body.treatmentTypes;
        delete req.body.treatmentPrices;
        delete req.body.treatmentMemos;

        req.models.AppTreatmentGroup.createTreatmentGroupByUser(req.body, petIds, function (status, data) {
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
