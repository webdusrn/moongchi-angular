
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
            'asReverse': 'meals',
            'allowNull': false
        },
        'chargeId': {
            'reference': 'AppCharge',
            'referenceKey': 'id',
            'referenceType': 'one',
            'as': 'charge',
            'asReverse': 'meal',
            'allowNull': true
        },
        'mealName': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': false
        },
        'mealStartDate': {
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
            name: 'authorId',
            fields: ['authorId']
        }, {
            name: 'mealName',
            fields: ['mealName']
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
            'getIncludeMeal': function () {
                return [{
                    model: sequelize.models.AppPetMeal,
                    as: "petMeals",
                    include: [{
                        model: sequelize.models.AppPet,
                        as: "pet"
                    }]
                }, {
                    model: sequelize.models.AppMealCharge,
                    as: "mealCharges",
                    include: [{
                        model: sequelize.models.AppCharge,
                        as: "charge"
                    }]
                }];
            },
            'createMeal': function (body, charge, callback) {
                var createdData = null;
                var include = req.models.AppMeal.getIncludeMeal();

                function createMeal (t) {
                    return sequelize.models.AppMeal.create(body, {
                        include: include,
                        transaction: t
                    }).then(function (data) {
                        createdData = data;
                        return true;
                    });
                }

                function createCharge (t) {
                    if (charge) {
                        return sequelize.models.AppCharge.create(charge, {
                            transaction: t
                        }).then(function (data) {
                            body.mealCharges = [{
                                chargeId: data.id
                            }];
                            return createMeal(t);
                        })
                    } else {
                        return createMeal(t);
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
            'updateMealById': function (reqId, body, reqUser, callback) {
                function updateMeal (t) {
                    return sequelize.models.AppMeal.update(body, {
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

                function findMeal (t) {
                    return sequelize.models.AppMeal.findOne({
                        where: {
                            authorId: reqUser.id,
                            id: reqId
                        },
                        transaction: t
                    }).then(function (data) {
                        if (data) {
                            return updateMeal(t);
                        } else {
                            throw new errorHandler.CustomSequelizeError(404, {
                                code: ""
                            });
                        }
                    });
                }

                sequelize.transaction(function (t) {
                    return findMeal(t);
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'deleteMealById': function (reqId, reqUser, callback) {
                function deleteMeal (t) {
                    return sequelize.models.AppMeal.destroy({
                        where: {
                            id: reqId
                        },
                        transaction: t
                    }).then(function () {
                        return sequelize.models.AppPetMeal.destroy({
                            where: {
                                mealId: reqId
                            },
                            transaction: t
                        });
                    }).then(function () {
                        return true;
                    });
                }

                function findMeal (t) {
                    return sequelize.models.AppMeal.findOne({
                        where: {
                            authorId: reqUser.id,
                            id: reqId
                        },
                        transaction: t
                    }).then(function (data) {
                        if (data) {
                            return deleteMeal(t);
                        } else {
                            throw new errorHandler.CustomSequelizeError(404, {
                                code: ""
                            });
                        }
                    });
                }

                sequelize.transaction(function (t) {
                    return findMeal(t);
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'findMealsByOptions': function (options, callback) {
                var count = 0;
                var loadedData = null;
                var where = {};
                var countWhere = {};
                var query = {
                    where: where,
                    order: [[options.orderBy, options.sort]],
                    limit: parseInt(options.size),
                    include: sequelize.models.AppTreatment.getIncludeMeal()
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

                sequelize.models.AppMeal.count({
                    where: countWhere
                }).then(function (data) {
                    if (data > 0) {
                        count = data;
                        return sequelize.models.AppMeal.findAll(query);
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