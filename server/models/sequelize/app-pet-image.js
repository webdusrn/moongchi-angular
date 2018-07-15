
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
var PET_IMAGE_UTIL = require('../../utils/pet-image');
var OBJECTIFY = require('../../../../core/server/utils/objectify');
module.exports = {
    fields: {
        'petId': {
            'reference': 'AppPet',
            'referenceKey': 'id',
            'as': 'pet',
            'asReverse': 'petImages',
            'allowNull': false
        },
        'imageId': {
            'reference': 'Image',
            'referenceKey': 'id',
            'as': 'image',
            'asReverse': 'petImages',
            'allowNull': false
        },
        'createdAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'updatedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        }
    },
    options: {
        'indexes': [{
            name: 'petId_imageId',
            fields: ['petId', 'imageId'],
            unique: true
        }, {
            name: 'petId',
            fields: ['petId']
        }, {
            name: 'imageId',
            fields: ['imageId']
        }, {
            name: 'createdAt',
            fields: ['createdAt']
        }],
        'timestamps': true,
        'createdAt': false,
        'updatedAt': false,
        'charset': CONFIG.db.charset,
        'collate': CONFIG.db.collate,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend({
            'deletePetImageByUser': function (reqId, reqUser, callback) {
                var query = `UPDATE AppPetImages AS petImage
                INNER JOIN AppPets AS pet ON petImage.petId = pet.id AND pet.deletedAt IS NULL
                INNER JOIN AppUserPets AS userPet ON userPet.petId = pet.id AND userPet.userId = ${reqUser.id}
                SET petImage.deletedAt = NOW()
                WHERE petImage.id = ${reqId}`;

                sequelize.query(query, {
                    type: Sequelize.QueryTypes.UPDATE
                }).then(function () {
                    return true;
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'findPetImageByUser': function (reqId, reqUser, callback) {
                var loadedData = null;

                sequelize.query(PET_IMAGE_UTIL.generateSelectByUserQuery({
                    id: reqId,
                    userId: reqUser.id,
                    orderBy: STD.petImage.defaultOrderBy,
                    sort: STD.common.DESC,
                    limit: 1
                }), {
                    type: Sequelize.QueryTypes.SELECT
                }).then(function (data) {
                    if (data && data.length) {
                        loadedData = OBJECTIFY.convert(data, {
                            image: {
                                attributes: sequelize.models.Image.attributes
                            }
                        })[0];
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404, {
                            code: '404_0002'
                        });
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, loadedData);
                    }
                });
            },
            'findPetImagesByUser': function (options, reqUser, callback) {
                options.userId = reqUser.id;

                var countQuery = PET_IMAGE_UTIL.generateCountByUserQuery(options);
                var selectQuery = PET_IMAGE_UTIL.generateSelectByUserQuery(options);

                sequelize.models.AppPet.findAndCountWithRawQuery(countQuery, selectQuery, function (status, data) {
                    if (status == 200) {
                        callback(status, {
                            count: data.count,
                            rows: OBJECTIFY.convert(data.rows, {
                                image: {
                                    attributes: sequelize.models.Image.attributes
                                }
                            })
                        });
                    } else if (status == 404) {
                        callback(status, {
                            code: '404_0002'
                        });
                    } else {
                        callback(status, data);
                    }
                });
            }
        }, mixin.options.classMethods)
    }
};