var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var MICRO = require('microtime-nodejs');
var dateExp = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');

put.validate = function () {
    return function (req, res, next) {
        var DIARY = req.meta.std.diary;
        var MAGIC = req.meta.std.magic;

        req.check('id', '400_12').isInt();

        if (req.body.diaryType !== undefined) req.check('diaryType', '400_3').isEnum(DIARY.enumDiaryTypes);
        if (req.body.diaryAt !== undefined) req.check('diaryAt', '400_18').isExp(dateExp);
        if (req.body.imageIds !== undefined && req.body.imageIds !== MAGIC.reset) {
            req.utils.common.toArray(req.body, 'imageIds');
        }

        if (!Object.keys(req.body).length) {
            return res.hjson(req, next, 204);
        }

        req.utils.common.checkError(req, res, next);
    };
};

put.validateDate = function () {
    return function (req, res, next) {
        var date = req.body.diaryAt;
        if (date !== undefined) {
            date = new Date(date + ' 00:00:00');
            if (isNaN(date.getTime())) {
                return res.hjson(req, next, 400, {
                    field: 'diaryAt',
                    code: "400_18"
                });
            } else {
                req.body.diaryAt = date;
                next();
            }
        } else {
            next();
        }
    };
};

put.checkAuthorization = function () {
    return function (req, res, next) {
        req.models.AppDiary.checkAuthorizationByUser(req.params.id, req.user, function (status, data) {
            if (status == 204) {
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

put.setParam = function () {
    return function (req, res, next) {
        var MAGIC = req.meta.std.magic;
        var diaryImages = null;

        if (req.body.imageIds !== undefined) {
            if (req.body.imageIds == MAGIC.reset) {
                diaryImages = MAGIC.reset;
            } else {
                var now = MICRO.now();
                diaryImages = [];
                req.body.imageIds.forEach(function (imageId) {
                    diaryImages.push({
                        diaryId: req.params.id,
                        imageId: imageId,
                        createdAt: now,
                        updatedAt: now
                    });
                });
            }
        }

        for (var k in req.body) {
            if (req.body[k] == MAGIC.reset) {
                req.body[k] = null;
            }
        }

        req.models.AppDiary.updateDiaryByUser(req.params.id, req.body, diaryImages, function (status, data) {
            if (status == 204) {
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 204);
    };
};

module.exports = put;
