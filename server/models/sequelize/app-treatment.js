
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
        'treatmentGroupId': {
            'reference': 'AppTreatmentGroup',
            'referenceKey': 'id',
            'as': 'treatmentGroup',
            'asReverse': 'treatments',
            'allowNull': true
        },
        'petId': {
            'reference': 'AppPet',
            'referenceKey': 'id',
            'as': 'pet',
            'asReverse': 'treatments',
            'allowNull': false
        },
        'treatmentType': {
            'type': Sequelize.ENUM,
            'values': STD.treatment.enumTreatmentTypes,
            'defaultValue': STD.treatment.defaultTreatmentType,
            'allowNull': false
        },
        'treatmentTitle': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': false
        },
        'treatmentContent': {
            'type': Sequelize.TEXT('long'),
            'allowNull': true
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
            name: 'treatmentGroupId',
            fields: ['treatmentGroupId']
        }, {
            name: 'petId',
            fields: ['petId']
        }, {
            name: 'treatmentType',
            fields: ['treatmentType']
        }, {
            name: 'treatmentTitle',
            fields: ['treatmentTitle']
        }, {
            name: 'createdAt',
            fields: ['createdAt']
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
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'getIncludeTreatment': function () {
                return [{
                    model: sequelize.models.AppPet,
                    as: "pet"
                }];
            }
        })
    }
};