
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
            'asReverse': 'poos',
            'allowNull': false
        },
        'pooType': {
            'type': Sequelize.ENUM,
            'values': STD.poo.enumPooTypes,
            'defaultValue': STD.poo.defaultPooType,
            'allowNull': false
        },
        'pooColor': {
            'type': Sequelize.ENUM,
            'values': STD.poo.enumPooColors,
            'allowNull': true
        },
        'pooDate': {
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
            name: 'pooType',
            fields: ['pooType']
        }, {
            name: 'pooColor',
            fields: ['pooColor']
        }, {
            name: 'pooDate',
            fields: ['pooDate']
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
            'deletePooById': function (reqId, reqUser, callback) {

                function deletePoo (t) {
                    return sequelize.models.AppPoo.destroy({
                        where: {
                            id: reqId
                        },
                        transaction: t
                    }).then(function () {
                        return true;
                    });
                }

                function findPoo (t) {
                    return sequelize.models.AppPoo.findOne({
                        include: [{
                            model: sequelize.models.AppPet,
                            as: "pet",
                            required: true,
                            include: [{
                                model: sequelize.models.AppUserPet,
                                as: "userPets",
                                where: {
                                    userId: reqUser.id
                                },
                                required: true
                            }]
                        }],
                        where: {
                            id: reqId
                        },
                        transaction: t
                    }).then(function (data) {
                        if (data) {
                            return deletePoo(t);
                        } else {
                            throw new errorHandler.CustomSequelizeError(404, {
                                code: ""
                            });
                        }
                    });
                }

                sequelize.transaction(function (t) {
                    return findPoo(t);
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'findPoosByOptions': function (options, callback) {
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

                if (options.offset !== undefined) {
                    query.offset = parseInt(options.offset);
                }

                if (options.petId !== undefined) {
                    where.petId = options.petId;
                    countWhere.petId = options.petId;
                }

                if (options.pooType !== undefined) {
                    where.pooType = options.pooType;
                    countWhere.pooType = options.pooType;
                }

                if (options.pooColor !== undefined) {
                    where.pooColor = options.pooColor;
                    countWhere.pooColor = options.pooColor;
                }

                if (options.startPooDate !== undefined) {
                    where.pooDate = {
                        $gt: options.startPooDate
                    };
                    countWhere.pooDate = {
                        $gt: options.startPooDate
                    };
                }

                if (options.endPooDate !== undefined) {
                    where.pooDate = {
                        $lt: options.endPooDate
                    };
                    countWhere.pooDate = {
                        $lt: options.endPooDate
                    };
                }

                sequelize.models.AppPoo.count(countQuery).then(function (data) {
                    if (data > 0) {
                        count = data;
                        return sequelize.models.AppPoo.findAll(query);
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