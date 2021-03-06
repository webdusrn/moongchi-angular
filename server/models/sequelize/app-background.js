
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
        'imageId': {
            'reference': 'Image',
            'referenceKey': 'id',
            'as': 'image',
            'asReverse': 'backgrounds',
            'allowNull': false
        },
        'isUse': {
            'type': Sequelize.BOOLEAN,
            'defaultValue': STD.background.defaultIsUse,
            'allowNull': false
        },
        'type': {
            'type': Sequelize.ENUM,
            'values': STD.background.enumTypes,
            'defaultValue': STD.background.defaultType,
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
            name: 'imageId',
            fields: ['imageId']
        }, {
            name: 'isUse',
            fields: ['isUse']
        }, {
            name: 'type',
            fields: ['type']
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
            'getIncludeBackground': function () {
                return [{
                    model: sequelize.models.Image,
                    as: 'image'
                }];
            },
            'findBackgroundsByOptionsByUser': function (options, callback) {
                var loadedData = null;

                var where = {};
                var query = {
                    include: sequelize.models.AppBackground.getIncludeBackground(),
                    where: where,
                    order: [[STD.background.defaultOrderBy, STD.common.ASC]]
                };

                if (options.types) {
                    where.type = options.types;
                }

                if (options.isUse) {
                    where.isUse = options.isUse;
                }

                sequelize.models.AppBackground.findAll(query).then(function (data) {
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
                            count: loadedData.length,
                            rows: loadedData
                        });
                    }
                });
            },
            'findBackgroundsByOptions': function (options, callback) {
                var count = 0;
                var loadedData = null;
                var where = {};
                var countWhere = {};
                var query = {
                    include: sequelize.models.AppBackground.getIncludeBackground(),
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

                if (options.offset !== undefined) {
                    query.offset = parseInt(options.offset);
                }

                if (options.types) {
                    where.type = options.types;
                    countWhere.type = options.types;
                }

                if (options.isUse) {
                    where.isUse = options.isUse;
                    countWhere.isUse = options.isUse;
                }

                sequelize.models.AppBackground.count({
                    where: countWhere
                }).then(function (data) {
                    if (data > 0) {
                        count = data;
                        return sequelize.models.AppBackground.findAll(query);
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
            },
            'deleteBackgroundById': function (reqId, callback) {
                sequelize.transaction(function (t) {
                    return sequelize.models.AppBackground.destroy({
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
            }
        }, mixin.options.classMethods)
    }
};