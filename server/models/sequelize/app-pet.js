
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
var PET_UTIL = require('../../utils/pet');
var OBJECTIFY = require('../../../../core/server/utils/objectify');
module.exports = {
    fields: {
        'petType': {
            'type': Sequelize.ENUM,
            'values': STD.pet.enumPetTypes,
            'defaultValue': STD.pet.defaultPetType,
            'allowNull': false
        },
        'petSeries': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true
        },
        'petGender': {
            'type': Sequelize.ENUM,
            'values': STD.pet.enumPetGenders,
            'defaultValue': STD.pet.defaultPetGender,
            'allowNull': false
        },
        'petName': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': false
        },
        'birthAt': {
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
            name: 'petSeries',
            fields: ['petSeries']
        }, {
            name: 'petGender',
            fields: ['petGender']
        }, {
            name: 'petName',
            fields: ['petName']
        }, {
            name: 'birthAt',
            fields: ['birthAt']
        }, {
            name: 'imageId',
            fields: ['imageId']
        }, {
            name: 'createdAt',
            fields: ['createdAt']
        }, {
            name: 'updatedAt',
            fields: ['updatedAt']
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
            'createPetByUser': function (body, treatmentGroups, callback) {
                var createdData = null;

                function createTreatmentGroup (t, index) {
                    return sequelize.models.AppTreatmentGroup.create(treatmentGroups[index], {
                        include: [{
                            model: sequelize.models.AppTreatment,
                            as: 'treatments'
                        }],
                        transaction: t
                    }).then(function () {
                        return true;
                    });
                }

                function createTreatmentGroups (t) {
                    if (treatmentGroups) {
                        var promises = [];

                        treatmentGroups.forEach(function (treatmentGroup, index) {
                            treatmentGroup.treatments[0].petId = createdData.id;
                            var promise = createTreatmentGroup(t, index);
                            promises.push(promise);
                        });

                        return Promise.all(promises).then(function () {
                            return true;
                        });
                    } else {
                        return true;
                    }
                }

                function createPet (t) {
                    return sequelize.models.AppPet.create(body, {
                        include: [{
                            model: sequelize.models.AppUserPet,
                            as: 'userPets'
                        }],
                        transaction: t
                    }).then(function (data) {
                        createdData = data;
                        return createTreatmentGroups(t);
                    });
                }

                sequelize.transaction(function (t) {
                    return createPet(t);
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(201, createdData);
                    }
                });
            },
            'updatePetByUser': function (reqId, body, treatmentGroups, deleteTreatmentTypes, callback) {

                if (!Object.keys(body).length && !treatmentGroups && !deleteTreatmentTypes) {
                    return callback(204);
                }

                function createTreatmentGroup (t, index) {
                    return sequelize.models.AppTreatmentGroup.create(treatmentGroups[index], {
                        include: [{
                            model: sequelize.models.AppTreatment,
                            as: 'treatments'
                        }],
                        transaction: t
                    }).then(function () {
                        return true;
                    });
                }

                function createTreatmentGroups (t) {
                    if (treatmentGroups) {
                        var promises = [];

                        treatmentGroups.forEach(function (treatmentGroup, index) {
                            var promise = createTreatmentGroup(t, index);
                            promises.push(promise);
                        });

                        return Promise.all(promises).then(function () {
                            return true;
                        });
                    } else {
                        return true;
                    }
                }

                function deleteTreatments (t) {
                    if (deleteTreatmentTypes) {
                        return sequelize.models.AppTreatment.destroy({
                            where: {
                                petId: reqId,
                                treatmentType: deleteTreatmentTypes
                            },
                            transaction: t
                        }).then(function () {
                            return createTreatmentGroups(t);
                        });
                    } else {
                        return createTreatmentGroups(t);
                    }
                }

                function updatePet (t) {
                    if (Object.keys(body).length) {
                        return sequelize.models.AppPet.update(body, {
                            where: {
                                id: reqId
                            },
                            transaction: t
                        }).then(function () {
                            return deleteTreatments(t);
                        });
                    } else {
                        return deleteTreatments(t);
                    }
                }

                sequelize.transaction(function (t) {
                    return updatePet(t);
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'findPetByUser': function (reqId, reqUser, callback) {
                var loadedData = null;

                sequelize.query(PET_UTIL.generateSelectByUserQuery({
                    id: reqId,
                    userId: reqUser.id,
                    orderBy: STD.pet.defaultOrderBy,
                    sort: STD.common.DESC,
                    size: 1
                }), {
                    type: Sequelize.QueryTypes.SELECT
                }).then(function (data) {
                    if (data && data.length) {
                        loadedData = OBJECTIFY.convert(data, {
                            image: {
                                attributes: sequelize.models.Image.attributes
                            },
                            treatments: []
                        })[0];
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404, {
                            code: '404_0001'
                        });
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, loadedData);
                    }
                });
            },
            'findPetsByUser': function (options, reqUser, callback) {
                options.userId = reqUser.id;

                var countQuery = PET_UTIL.generateCountByUserQuery(options);
                var selectQuery = PET_UTIL.generateSelectByUserQuery(options);

                sequelize.models.AppPet.findAndCountWithRawQuery(countQuery, selectQuery, function (status, data) {
                    if (status == 200) {
                        callback(status, {
                            count: data.count,
                            rows: OBJECTIFY.convert(data.rows, {
                                image: {
                                    attributes: sequelize.models.Image.attributes
                                },
                                treatments: []
                            })
                        });
                    } else if (status == 404) {
                        callback(status, {
                            code: '404_0001'
                        });
                    } else {
                        callback(status, data);
                    }
                });
            },
            'deletePetByUser': function (reqId, reqUser, callback) {

                function deletePet (t) {
                    return sequelize.models.AppPet.destroy({
                        where: {
                            petId: reqId
                        },
                        transaction: t
                    }).then(function () {
                        return true;
                    });
                }

                function countUserPet (t) {
                    return sequelize.models.AppUserPet.count({
                        where: {
                            petId: reqId
                        },
                        transaction: t
                    }).then(function (data) {
                        if (data) {
                            return true;
                        } else {
                            return deletePet(t);
                        }
                    });
                }

                function deleteUserPet (t) {
                    return sequelize.models.AppUserPet.destroy({
                        where: {
                            petId: reqId,
                            userId: reqUser.id
                        },
                        transaction: t
                    }).then(function () {
                        return countUserPet(t);
                    });
                }

                sequelize.transaction(function (t) {
                    return deleteUserPet(t);
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'findPetSeriesByUser': function (reqUser, callback) {
                var loadedData = null;
                var query = `SELECT pet.petSeries FROM AppPets AS pet
                INNER JOIN AppUserPets AS userPet ON userPet.petId = pet.id AND userPet.userId = ${reqUser.id}
                WHERE pet.deletedAt IS NULL
                GROUP BY pet.petSeries`;

                sequelize.query(query, {
                    type: Sequelize.QueryTypes.SELECT
                }).then(function (data) {
                    if (data && data.length) {
                        loadedData = data;
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404);
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, loadedData);
                    }
                });
            }
        }, mixin.options.classMethods)
    }
};