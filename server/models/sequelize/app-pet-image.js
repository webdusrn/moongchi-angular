
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
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'getIncludePetImage': function () {
                return [{
                    model: sequelize.models.Image,
                    as: 'image'
                }];
            },
            'createPetImages': function (petId, imageIds, callback) {
                var createdData = null;
                var include = sequelize.models.AppPetImage.getIncludePetImage();

                function findPetImages (t) {
                    return sequelize.models.AppPetImage.findAll({
                        include: include,
                        where: {
                            petId: petId,
                            imageId: imageIds
                        },
                        transaction: t
                    }).then(function (data) {
                        createdData = data;
                        return true;
                    });
                }

                function createPetImages (t) {
                    var petImages = [];
                    imageIds.forEach(function (imageId) {
                        petImages.push({
                            petId: petId,
                            imageId: imageId
                        });
                    });
                    return sequelize.models.AppPetImage.bulkCreate(petImages, {
                        individualHooks: true,
                        transaction: t
                    }).then(function () {
                        return findPetImages(t);
                    });
                }

                sequelize.transaction(function (t) {
                    return createPetImages(t);
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(201, {
                            rows: createdData
                        });
                    }
                });
            },
            'deletePetImageById': function (reqId, callback) {
                sequelize.transaction(function (t) {
                    return sequelize.models.AppPetImage.destroy({
                        where: {
                            id: reqId
                        },
                        transaction: t
                    }).then(function () {
                        return true;
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'findPetImagesByOptions': function (options, reqUser, callback) {
                var count = 0;
                var loadedData = null;
                var where = {};
                var countWhere = {};
                var query = {
                    where: where,
                    order: [[options.orderBy, options.sort]],
                    limit: parseInt(options.size)
                };

                if (options.last !== undefined) {
                    if (options.sort == STD.common.DESC) {
                        where[options.orderBy] = {
                            "$lt": options.last
                        };
                    } else {
                        where[options.orderBy] = {
                            "$gt": options.last
                        };
                    }
                }

                if (options.petId !== undefined) {
                    where.petId = options.petId;
                    countWhere.petId = options.petId
                }

                sequelize.models.AppPetImage.count({
                    where: countWhere
                }).then(function (data) {
                    if (data > 0) {
                        count = data;
                        return sequelize.models.AppPetImage.findAll(query);
                    } else {
                        throw new errorHandler.CustomSequelizeError(404, {
                            code: ""
                        });
                    }
                }).then(function (data) {
                    if (data && data.length) {
                        loadedData = data;
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404, {
                            code: ""
                        });
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, {
                            count: count,
                            rows: loadedData
                        });
                    }
                });
            }
        })
    }
};