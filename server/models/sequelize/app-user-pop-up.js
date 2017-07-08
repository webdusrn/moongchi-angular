
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
var MICRO = require('microtime-nodejs');
var getDBStringLength = require('../../../../core/server/utils').initialization.getDBStringLength;
module.exports = {
    fields: {
        'userId': {
            'reference': 'User',
            'referenceKey': 'id',
            'as': 'user',
            'asReverse': 'userPopUps',
            'allowNull': false
        },
        'popUpId': {
            'reference': 'AppPopUp',
            'referenceKey': 'id',
            'as': 'popUp',
            'asReverse': 'userPopUps',
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
            name: 'userId_popUpId',
            fields: ['userId', 'popUpId'],
            unique: true
        }, {
            name: 'useId',
            fields: ['userId']
        }, {
            name: 'popUpId',
            fields: ['popUpId']
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
            'upsertUserPopUp': function (popUpId, reqUserId, callback) {
                sequelize.transaction(function (t) {
                    return sequelize.models.AppUserPopUp.findOne({
                        where: {
                            popUpId: popUpId,
                            userId: reqUserId
                        },
                        transaction: t
                    }).then(function (data) {
                        if (data) {
                            return true;
                        } else {
                            return sequelize.models.AppUserPopUp.upsert({
                                popUpId: popUpId,
                                userId: reqUserId,
                                createdAt: MICRO.now(),
                                updatedAt: MICRO.now()
                            }, {
                                transaction: t
                            }).then(function () {
                                return true;
                            });
                        }
                    });
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            }
        })
    }
};