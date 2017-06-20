
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
        'authorId': {
            'reference': 'User',
            'referenceKey': 'id',
            'as': 'author',
            'asReverse': 'pets',
            'allowNull': false
        },
        'petType': {
            'type': Sequelize.ENUM,
            'values': STD.pet.enumPetTypes,
            'defaultValue': STD.pet.defaultPetType,
            'allowNull': false
        },
        'petName': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': false
        },
        'petBirthDay': {
            'type': Sequelize.DATE,
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
            name: 'authorId',
            fields: ['authorId']
        }, {
            name: 'petType',
            fields: ['petType']
        }, {
            name: 'petName',
            fields: ['petName']
        }, {
            name: 'petBirthDay',
            fields: ['petBirthDay']
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

        })
    }
};