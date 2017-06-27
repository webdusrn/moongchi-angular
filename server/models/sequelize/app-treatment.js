
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
        'hospitalName': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true
        },
        'treatmentContent': {
            'type': Sequelize.TEXT('long'),
            'allowNull': true
        },
        'treatmentDate': {
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
            name: 'treatmentType',
            fields: ['treatmentType']
        }, {
            name: 'treatmentTitle',
            fields: ['treatmentTitle']
        }, {
            name: 'hospitalName',
            fields: ['hospitalName']
        }, {
            name: 'treatmentDate',
            fields: ['treatmentDate']
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
                    model: sequelize.models.AppPetTreatment,
                    as: "petTreatments",
                    include: [{
                        model: sequelize.models.AppPet,
                        as: "pet"
                    }]
                }, {
                    model: sequelize.models.AppTreatmentCharge,
                    as: "treatmentCharges",
                    include: [{
                        model: sequelize.models.AppCharge,
                        as: "charge"
                    }]
                }];
            },
            'updateTreatmentById': function (reqId, body, reqUser, callback) {
                function updateTreatment (t) {
                    return sequelize.models.AppTreatment.update(body, {
                        where: {
                            id: reqId
                        },
                        transaction: t
                    }).then(function (data) {
                        if (data[0]) {
                            return true;
                        } else {
                            throw new errorHandler.CustomSequelizeError(404, {
                                code: ""
                            });
                        }
                    });
                }

                function findTreatment (t) {
                    return sequelize.models.AppTreatment.findOne({
                        where: {
                            authorId: reqUser,
                            id: reqId
                        },
                        transaction: t
                    }).then(function (data) {
                        if (data) {
                            return updateTreatment(t);
                        } else {
                            throw new errorHandler.CustomSequelizeError(404, {
                                code: ""
                            });
                        }
                    });
                }

                sequelize.transaction(function (t) {
                    return findTreatment(t);
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'deleteTreatmentById': function (reqId, reqUser, callback) {
                function deleteTreatment (t) {
                    return sequelize.models.AppTreatment.destroy({
                        where: {
                            id: reqId
                        },
                        transaction: t
                    }).then(function () {
                        return sequelize.models.AppPetTreatment.destroy({
                            where: {
                                treatmentId: reqId
                            },
                            transaction: t
                        });
                    }).then(function () {
                        return sequelize.models.AppTreatmentCharge.destroy({
                            where: {
                                treatmentId: reqId
                            },
                            transaction: t
                        });
                    }).then(function () {
                        return true;
                    });
                }

                function findTreatment (t) {
                    return sequelize.models.AppTreatment.findOne({
                        where: {
                            authorId: reqUser.id,
                            id: reqId
                        },
                        transaction: t
                    }).then(function (data) {
                        if (data) {
                            return deleteTreatment(t);
                        } else {
                            throw new errorHandler.CustomSequelizeError(404, {
                                code: ""
                            });
                        }
                    });
                }

                sequelize.transaction(function (t) {
                    return findTreatment(t);
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'findTreatmentsByOptions': function (options, callback) {
                var count = 0;
                var loadedData = null;
                var where = {};
                var countWhere = {};
                var query = {
                    where: where,
                    order: [[options.orderBy, options.sort]],
                    limit: parseInt(options.size),
                    include: sequelize.models.AppTreatment.getIncludeTreatment()
                };

                if (options.searchItem && options.searchField) {

                } else if (options.searchItem) {

                }

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

                if (options.authorId !== undefined) {
                    countWhere.authorId = options.authorId;
                    where.authorId = options.authorId;
                }

                if (options.treatmentType !== undefined) {
                    countWhere.treatmentType = options.treatmentType;
                    where.treatmentType = options.treatmentType;
                }

                sequelize.models.AppTreatment.count({
                    where: countWhere
                }).then(function (data) {
                    if (data > 0) {
                        count = data;
                        return sequelize.models.AppTreatment.findAll(query);
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