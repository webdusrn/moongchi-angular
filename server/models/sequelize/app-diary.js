
/**
 * 응답콜백
 * @callback responseCallback
 * @param {number} status - 상태코드
 * @param {Object} data - 성공일 경우 반환된 데이터
 */

var Sequelize = require('sequelize');
var sequelize = require('../../../../core/server/config/sequelize');

var mixin = require('../../../../core/server/models/sequelize/mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
var LOCAL = require('../../../../bridge/metadata/localization');
var CONFIG = require('../../../../bridge/config/env');
var getDBStringLength = require('../../../../core/server/utils').initialization.getDBStringLength;
var OBJECTIFY = require('../../../../core/server/utils/objectify');
var DIARY_UTIL = require('../../utils/diary');
module.exports = {
    fields: {
        'petId': {
            'reference': 'AppPet',
            'referenceKey': 'id',
            'as': 'pet',
            'asReverse': 'diaries',
            'allowNull': false
        },
        'diaryType': {
            'type': Sequelize.ENUM,
            'values': STD.diary.enumDiaryTypes,
            'defaultValue': STD.diary.defaultDiaryType,
            'allowNull': false
        },
        'diaryContent': {
            'type': Sequelize.TEXT('long'),
            'allowNull': true
        },
        'diaryAt': {
            'type': Sequelize.DATE,
            'allowNull': false
        },
        'createdAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'updatedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'deletedAt': {
            'type': Sequelize.DATE,
            'allowNull': true
        }
    },
    options: {
        'indexes': [{
            name: 'petId',
            fields: ['petId']
        }, {
            name: 'diaryType',
            fields: ['diaryType']
        }, {
            name: 'diaryAt',
            fields: ['diaryAt']
        }, {
            name: 'createdAt',
            fields: ['createdAt']
        }, {
            name: 'deletedAt',
            fields: ['deletedAt']
        }],
        'timestamps': true,
        'createdAt': false,
        'updatedAt': false,
        'paranoid': true,
        'charset': CONFIG.db.charset,
        'collate': CONFIG.db.collate,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend({
            'checkAuthorizationByUser': function (reqId, reqUser, callback) {
                var query = `SELECT COUNT(*) AS count FROM AppDiaries AS diary
                INNER JOIN AppUserPets AS userPet ON userPet.petId = diary.petId AND userPet.userId = ${reqUser.id}
                INNER JOIN AppPets AS pet ON diary.petId = pet.id AND pet.deletedAt IS NULL
                WHERE diary.id = ${reqId}`;

                sequelize.query(query, {
                    type: Sequelize.QueryTypes.SELECT
                }).then(function (data) {
                    if (data && data.length && data[0].count) {
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404, {
                            code: '404_0004'
                        });
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'updateDiaryByUser': function (reqId, update, diaryImages, callback) {

                function updateDiaryImages (t) {
                    if (diaryImages) {
                        return sequelize.models.AppDiaryImage.destroy({
                            where: {
                                diaryId: reqId
                            },
                            transaction: t
                        }).then(function () {
                            if (diaryImages == STD.magic.reset) {
                                return true;
                            } else {
                                return sequelize.models.AppDiaryImage.bulkCreate(diaryImages, {
                                    transaction: t
                                }).then(function () {
                                    return true;
                                });
                            }
                        });
                    } else {
                        return true;
                    }
                }

                function updateDiary (t) {
                    if (Object.keys(update).length) {
                        return sequelize.models.AppDiary.update(update, {
                            where: {
                                id: reqId
                            },
                            transaction: t
                        }).then(function () {
                            return updateDiaryImages(t);
                        });
                    } else {
                        return updateDiaryImages(t);
                    }
                }

                sequelize.transaction(function (t) {
                    return updateDiary(t);
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'deleteDiaryByUser': function (reqId, callback) {
                sequelize.models.AppDiary.destroy({
                    where: {
                        id: reqId
                    },
                    cascade: true
                }).then(function () {
                    return true;
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'findDiaryByUser': function (reqId, reqUser, callback) {
                var loadedData = null;

                sequelize.query(DIARY_UTIL.generateSelectByUserQuery({
                    id: reqId,
                    userId: reqUser.id,
                    orderBy: STD.diary.defaultOrderBy,
                    sort: STD.common.DESC,
                    size: 1
                }), {
                    type: Sequelize.QueryTypes.SELECT
                }).then(function (data) {
                    if (data && data.length) {
                        loadedData = OBJECTIFY.convert(data, {
                            pet: {},
                            images: [{
                                attributes: sequelize.models.Image.attributes
                            }]
                        })[0];
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404, {
                            code: '404_0004'
                        });
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, loadedData);
                    }
                });
            },
            'findDiariesByUser': function (options, reqUser, callback) {
                options.userId = reqUser.id;

                var countQuery = DIARY_UTIL.generateCountByUserQuery(options);
                var selectQuery = DIARY_UTIL.generateSelectByUserQuery(options);

                sequelize.models.AppDiary.findAndCountWithRawQuery(countQuery, selectQuery, function (status, data) {
                    if (status == 200) {
                        callback(status, {
                            count: data.count,
                            rows: OBJECTIFY.convert(data.rows, {
                                pet: {},
                                images: [{
                                    attributes: sequelize.models.Image.attributes
                                }]
                            })
                        });
                    } else if (status == 404) {
                        callback(status, {
                            code: '404_0004'
                        });
                    } else {
                        callback(status, data);
                    }
                });
            }
        }, mixin.options.classMethods)
    }
};