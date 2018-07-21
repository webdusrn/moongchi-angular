var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var dateExp = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$');

post.validate = function () {
    return function (req, res, next) {
        var DIARY = req.meta.std.diary;

        req.check('petId', '400_12').isInt();
        req.check('diaryType', '400_3').isEnum(DIARY.enumDiaryTypes);
        req.check('diaryAt', '400_18').isExp(dateExp);

        if (req.body.imageIds !== undefined) {
            req.utils.common.toArray(req.body, 'imageIds');
        }

        req.utils.common.checkError(req, res, next);
    };
};

post.validateDate = function () {
    return function (req, res, next) {
        var date = req.body.diaryAt;
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
    };
};

post.checkAuthorization = function () {
    return function (req, res, next) {
        req.models.AppUserPet.checkAuthorization(req.user, req.body.petId, function (status, data) {
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
        if (req.body.imageIds !== undefined) {
            req.body.diaryImages = [];
            req.body.imageIds.forEach(function (imageId) {
                req.body.diaryImages.push({
                    imageId: imageId
                });
            });
        }
        delete req.body.imageIds;

        var include = [{
            model: req.models.AppDiaryImage,
            as: 'diaryImages',
            include: [{
                model: req.models.Image,
                as: 'image'
            }]
        }];

        req.models.AppDiary.createDataIncluding(req.body, include, function (status, data) {
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
        req.models.AppDiary.findDiaryByUser(req.data.id, req.user, function (status, data) {
            if (status == 200) {
                res.hjson(req, next, 201, data);
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

module.exports = post;
