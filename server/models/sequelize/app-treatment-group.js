
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
var TREATMENT_GROUP_UTIL = require('../../utils/treatment-group');
var PET_UTIL = require('../../utils/pet');
var OBJECTIFY = require('../../../../core/server/utils/objectify');
module.exports = {
    fields: {
        'hospitalName': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': true
        },
        'treatmentTotalPrice': {
            'type': Sequelize.INTEGER,
            'allowNull': true
        },
        'treatmentAt': {
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
        }
    },
    options: {
        'indexes': [{
            name: 'hospitalName',
            fields: ['hospitalName']
        }, {
            name: 'treatmentAt',
            fields: ['treatmentAt']
        }, {
            name: 'createdAt',
            fields: ['createdAt']
        }],
        'timestamps': true,
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
        'classMethods': Sequelize.Utils._.extend({
            'checkAuthorizationByUser': function (reqId, reqUser, callback) {
                var query = `SELECT COUNT(*) AS count FROM AppTreatmentGroups AS treatmentGroup
                INNER JOIN AppTreatments AS treatment ON treatment.treatmentGroupId = treatmentGroup.id AND treatment.deletedAt IS NULL
                INNER JOIN AppUserPets AS userPet ON userPet.petId = treatment.petId AND userPet.userId = ${reqUser.id}
                INNER JOIN AppPets AS pet ON treatment.petId = pet.id AND pet.deletedAt IS NULL
                WHERE treatmentGroup.id = ${reqId}`;

                sequelize.query(query, {
                    type: Sequelize.QueryTypes.SELECT
                }).then(function (data) {
                    if (data && data.length && data[0].count) {
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404, {
                            code: '404_0003'
                        });
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'createTreatmentGroupByUser': function (body, petIds, callback) {
                var createdData = null;

                function checkTreatmentTypes (t) {
                    var query = `SELECT treatment.treatmentType, COUNT(treatment.id) AS count FROM AppTreatments AS treatment
                    WHERE treatment.deletedAt IS NULL
                    AND treatment.petId IN(${petIds.join(', ')})
                    AND treatment.treatmentType IN(${PET_UTIL.returnPetTreatmentTypesQuery()})
                    GROUP BY treatment.petId, treatment.treatmentType
                    HAVING COUNT(treatment.id) > 1`;

                    return sequelize.query(query, {
                        type: Sequelize.QueryTypes.SELECT,
                        transaction: t
                    }).then(function (data) {
                        if (data && data.length) {
                            throw new errorHandler.CustomSequelizeError(400, {
                                treatmentType: data[0].treatmentType,
                                code: '400_0001'
                            });
                        } else {
                            return true;
                        }
                    });
                }

                function createTreatmentGroup (t) {
                    var include = [{
                        model: sequelize.models.AppTreatment,
                        as: 'treatments',
                        include: [{
                            model: sequelize.models.AppPet,
                            as: 'pet',
                            include: [{
                                model: sequelize.models.Image,
                                as: 'image'
                            }]
                        }]
                    }];
                    return sequelize.models.AppTreatmentGroup.create(body, {
                        include: include,
                        transaction: t
                    }).then(function (data) {
                        createdData = data;
                        return checkTreatmentTypes(t);
                    });
                }

                sequelize.transaction(function (t) {
                    return createTreatmentGroup(t);
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(201);
                    }
                });
            },
            'deleteTreatmentGroupByUser': function (reqId, callback) {

                sequelize.models.AppTreatmentGroup.destroy({
                    where: {
                        id: reqId
                    },
                    cascade: true
                }).then(function () {
                    return true;
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'findTreatmentGroupByUser': function (reqId, reqUser, callback) {
                var loadedData = null;

                sequelize.query(TREATMENT_GROUP_UTIL.generateSelectByUserQuery({
                    id: reqId,
                    userId: reqUser.id,
                    orderBy: STD.treatmentGroup.defaultOrderBy,
                    sort: STD.common.DESC,
                    size: 1
                }), {
                    type: Sequelize.QueryTypes.SELECT
                }).then(function (data) {
                    if (data && data.length) {
                        loadedData = OBJECTIFY.convert(data, {
                            treatments: [{
                                pet: {
                                    image: {
                                        attributes: sequelize.models.Image.attributes
                                    }
                                }
                            }]
                        })[0];
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404, {
                            code: '404_0003'
                        });
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, loadedData);
                    }
                });
            },
            'findTreatmentGroupsByUser': function (options, reqUser, callback) {
                options.userId = reqUser.id;

                var countQuery = TREATMENT_GROUP_UTIL.generateCountByUserQuery(options);
                var selectQuery = TREATMENT_GROUP_UTIL.generateSelectByUserQuery(options);

                sequelize.models.AppTreatmentGroup.findAndCountWithRawQuery(countQuery, selectQuery, function (status, data) {
                    if (status == 200) {
                        callback(status, {
                            count: data.count,
                            rows: OBJECTIFY.convert(data.rows, {
                                treatments: [{
                                    pet: {
                                        image: {
                                            attributes: sequelize.models.Image.attributes
                                        }
                                    }
                                }]
                            })
                        });
                    } else if (status == 404) {
                        callback(status, {
                            code: '404_0003'
                        });
                    } else {
                        callback(status, data);
                    }
                });
            }
        }, mixin.options.classMethods)
    }
};