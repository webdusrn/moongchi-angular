
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
            'asReverse': 'charges',
            'allowNull': false
        },
        'chargeTitle': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': false
        },
        'chargeContent': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true
        },
        'chargeDate': {
            'type': Sequelize.DATE,
            'allowNull': false
        },
        'charge': {
            'type': Sequelize.INTEGER,
            'defaultValue': STD.charge.defaultCharge,
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
            name: 'authorId',
            fields: 'authorId'
        }, {
            name: 'chargeTitle',
            fields: ['chargeTitle']
        }, {
            name: 'chargeContent',
            fields: ['chargeContent']
        }, {
            name: 'charge',
            fields: ['charge']
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
            'getIncludeCharge': function () {
                return [{
                    model: sequelize.models.AppMealCharge,
                    as: "mealCharges",
                    include: [{
                        model: sequelize.models.AppMeal,
                        as: "meal"
                    }]
                }, {
                    model: sequelize.models.AppTreatmentCharge,
                    as: "treatmentCharges",
                    include: [{
                        model: sequelize.models.AppTreatment,
                        as: "treatment"
                    }]
                }];
            },
            'createTreatment': function (body, charge, callback) {
                var include = sequelize.models.AppTreatment.getIncludeTreatment();
                var createdData = null;

                function createTreatment (t) {
                    return sequelize.models.AppTreatment.create(body, {
                        include: include,
                        transaction: t
                    }).then(function(data) {
                        createdData = data;
                        return true;
                    });
                }

                function createCharge (t) {
                    if (charge) {
                        return sequelize.models.AppCharge.create(charge, {
                            transaction: t
                        }).then(function (data) {
                            body.treatmentCharges = [{
                                chargeId: data.id
                            }];
                            return createTreatment(t);
                        });
                    } else {
                        return createTreatment(t);
                    }
                }

                sequelize.transaction(function (t) {
                    return createCharge(t);
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(201, createdData);
                    }
                });
            },
            'updateChargeById': function (reqId, body, reqUser, callback) {
                function updateCharge (t) {
                    return sequelize.models.AppCharge.update(body, {
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

                function findCharge (t) {
                    return sequelize.models.AppCharge.findOne({
                        where: {
                            id: reqId,
                            authorId: reqUser.id
                        },
                        transaction: t
                    }).then(function (data) {
                        if (data) {
                            return updateCharge(t);
                        } else {
                            throw new errorHandler.CustomSequelizeError(404, {
                                code: ""
                            });
                        }
                    });
                }

                sequelize.transaction(function (t) {
                    return findCharge(t);
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'findChargesByOptions': function (options, callback) {
                var count = 0;
                var loadedData = null;
                var where = {};
                var countWhere = {};
                var query = {
                    where: where,
                    order: [[options.orderBy, options.sort]],
                    limit: parseInt(options.size),
                    include: sequelize.models.AppCharge.getIncludeCharge()
                };

                if (options.searchItem && options.searchField) {
                    if (options.searchField == STD.common.id) {
                        where[options.searchField] = options.searchItem;
                        countWhere[options.searchField] = options.searchItem;
                    } else {
                        where[options.searchField] = {
                            "$like": options.searchItem + "%"
                        };
                        countWhere[options.searchField] = {
                            "$like": options.searchItem + "%"
                        };
                    }
                } else if (options.searchItem) {
                    where.$or = [];
                    countWhere.$or = [];
                    var enumSearchFields = STD.charge.enumSearchFields;
                    for (var i=0; i<enumSearchFields.length; i++) {
                        var body = {};
                        if (enumSearchFields[i] == STD.common.id) {
                            body[enumSearchFields[i]] = options.searchItem;
                        } else {
                            body[enumSearchFields[i]] = {
                                "$like": options.searchItem + "%"
                            };
                        }
                        where.$or.push(body);
                        countWhere.$or.push(body);
                    }
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

                sequelize.models.AppCharge.count({
                    where: countWhere
                }).then(function (data) {
                    if (data > 0) {
                        count = data;
                        return sequelize.models.AppCharge.findAll(query);
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
            'deleteChargeById': function (reqId, reqUser, callback) {

                function deleteCharge (t) {
                    return sequelize.models.AppCharge.destroy({
                        where: {
                            id: reqId
                        },
                        transaction: t
                    }).then(function () {
                        return true;
                    });
                }

                function findCharge (t) {
                    return sequelize.models.AppCharge.findOne({
                        where: {
                            authorId: reqUser.id,
                            id: reqId
                        },
                        transaction: t
                    }).then(function (data) {
                        if (data) {
                            return deleteCharge(t);
                        } else {
                            throw new errorHandler.CustomSequelizeError(404, {
                                code: ""
                            });
                        }
                    });
                }

                sequelize.transaction(function (t) {
                    return findCharge(t);
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            }
        })
    }
};