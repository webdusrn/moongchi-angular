
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
        'userId': {
            'reference': 'User',
            'referenceKey': 'id',
            'as': 'user',
            'asReverse': 'userPets',
            'allowNull': false
        },
        'petId': {
            'reference': 'AppPet',
            'referenceKey': 'id',
            'as': 'pet',
            'asReverse': 'userPets',
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
            name: 'userId_petId',
            fields: ['userId', 'petId'],
            unique: true
        }, {
            name: 'userId',
            fields: ['userId']
        }, {
            name: 'petId',
            fields: ['petId']
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
            'checkAuthorization': function (reqUser, petId, callback) {
                sequelize.models.AppUserPet.count({
                    where: {
                        userId: reqUser.id,
                        petId: petId
                    }
                }).then(function (data) {
                    if (data) {
                        if (petId instanceof Array) {
                            if (data == petId.length) {
                                return true;
                            } else {
                                throw new errorHandler.CustomSequelizeError(403, {
                                    code: '403_0001'
                                });
                            }
                        } else {
                            return true;
                        }
                    } else {
                        throw new errorHandler.CustomSequelizeError(403, {
                            code: '403_0001'
                        });
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            }
        }, mixin.options.classMethods)
    }
};