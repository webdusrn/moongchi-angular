
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
        'petGender': {
            'type': Sequelize.ENUM,
            'values': STD.pet.enumPetGenders,
            'defaultValue': STD.pet.defaultPetGender,
            'allowNull': false
        },
        'petBirthDate': {
            'type': Sequelize.DATE,
            'allowNull': true
        },
        'imageId': {
            'reference': 'Image',
            'referenceKey': 'id',
            'as': 'image',
            'asReverse': 'pets',
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
            name: 'petType',
            fields: ['petType']
        }, {
            name: 'petName',
            fields: ['petName']
        }, {
            name: 'petGender',
            fields: ['petGender']
        }, {
            name: 'petBirthDate',
            fields: ['petBirthDate']
        }, {
            name: 'imageId',
            fields: ['imageId']
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
            'getIncludePet': function () {
                return [{
                    model: sequelize.models.AppPetImage,
                    as: "petImages",
                    include: sequelize.models.AppPetImage.getIncludePetImage()
                }];
            },
            'updatePetById': function (reqId, body, reqUser, callback) {
                function updatePet (t) {
                    return sequelize.models.AppPet.update(body, {
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

                function findPet(t) {
                    return sequelize.models.AppPet.findOne({
                        include: [{
                            model: sequelize.models.AppUserPet,
                            as: "userPets",
                            where: {
                                userId: reqUser.id
                            },
                            required: true
                        }],
                        where: {
                            id: reqId
                        },
                        transaction: t
                    }).then(function (data) {
                        if (data) {
                            return updatePet(t);
                        } else {
                            throw new errorHandler.CustomSequelizeError(404, {
                                code: ""
                            });
                        }
                    });
                }

                sequelize.transaction(function (t) {
                    return findPet(t);
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'deletePetById': function (reqId, reqUser, callback) {
                var petInclude = [{
                    model: sequelize.models.AppUserPet,
                    as: "userPets",
                    where: {
                        userId: reqUser.id
                    },
                    required: true
                }];

                function destroy (t) {
                    return sequelize.models.AppPet.destroy({
                        where: {
                            id: reqId
                        },
                        transaction: t
                    }).then(function () {
                        return sequelize.models.AppPetImage.destroy({
                            where: {
                                petId: reqId
                            },
                            transaction: t
                        });
                    }).then(function () {
                        return sequelize.models.AppPetMeal.destroy({
                            where: {
                                petId: reqId
                            },
                            transaction: t
                        });
                    }).then(function () {
                        return sequelize.models.AppPetTreatment.destroy({
                            where: {
                                petId: reqId
                            },
                            transaction: t
                        });
                    }).then(function () {
                        return sequelize.models.AppPoo.destroy({
                            where: {
                                petId: reqId
                            },
                            transaction: t
                        });
                    }).then(function () {
                        return true;
                    });
                }

                function findPet (t) {
                    return sequelize.models.AppPet.findById(reqId, {
                        include: petInclude,
                        transaction: t
                    }).then(function (data) {
                        if (data) {
                            return destroy(t);
                        } else {
                            throw new errorHandler.CustomSequelizeError(404, {
                                code: ""
                            });
                        }
                    });
                }

                sequelize.transaction(function (t) {
                    return findPet(t);
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'findPetsByOptions': function (options, callback) {
                var count = 0;
                var loadedData = null;
                var where = {};
                var countWhere = {};
                var query = {
                    where: where,
                    order: [[options.orderBy, options.sort]],
                    limit: parseInt(options.size),
                    include: sequelize.models.AppPet.getIncludePet()
                };
                var countQuery = {
                    where: countWhere
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

                if (options.petType !== undefined) {
                    where.petType = options.petType;
                    countWhere.petType = options.petType;
                }

                if (options.petGender !== undefined) {
                    where.petGender = options.petGender;
                    countWhere.petGender = options.petGender;
                }

                if (options.userId !== undefined) {
                    countQuery.include = [{
                        model: sequelize.models.AppUserPet,
                        as: "userPets",
                        where: {
                            userId: options.userId
                        },
                        required: true
                    }];
                    query.include.push({
                        model: sequelize.models.AppUserPet,
                        as: "userPets",
                        where: {
                            userId: options.userId
                        },
                        required: true
                    });
                }

                sequelize.models.AppPet.count(countQuery).then(function (data) {
                    if (data > 0) {
                        count = data;
                        return sequelize.models.AppPet.findAll(query);
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
                        callback({
                            count: count,
                            rows: loadedData
                        });
                    }
                });
            }
        })
    }
};