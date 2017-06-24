
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
        'treatmentId': {
            'reference': 'AppTreatment',
            'referenceKey': 'id',
            'as': 'treatment',
            'asReverse': 'treatmentCharges',
            'allowNull': false
        },
        'chargeId': {
            'reference': 'AppCharge',
            'referenceKey': 'id',
            'as': 'charge',
            'asReverse': 'treatmentCharges',
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
            name: 'treatmentId_chargeId',
            fields: ['treatmentId', 'chargeId'],
            unique: true
        }, {
            name: 'treatmentId',
            fields: ['treatmentId']
        }, {
            name: 'chargeId',
            fields: ['chargeId']
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
            }
        })
    }
};