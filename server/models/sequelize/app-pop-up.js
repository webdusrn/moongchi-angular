
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
            'asReverse': 'popUps',
            'allowNull': false
        },
        'isView': {
            'type': Sequelize.BOOLEAN,
            'defaultValue': false,
            'allowNull': false
        },
        'title': {
            'type': Sequelize.STRING(getDBStringLength()),
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
            name: 'isView',
            fields: ['isView']
        }, {
            name: 'title',
            fields: ['title']
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
            'getIncludePopUp': function () {
                return [{
                    model: sequelize.models.Image,
                    as: "image"
                }];
            },
            'deletePopUp': function (reqId, callback) {
                sequelize.transaction(function (t) {
                    return sequelize.models.AppPopUp.destroy({
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
            },
            'findCurrentPopUp': function (reqUser, callback) {
                var loadedData = null;

                sequelize.models.AppPopUp.findOne({
                    include: [{
                        model: sequelize.models.Image,
                        as: "image"
                    }, {
                        model: sequelize.models.AppUserPopUp,
                        as: "userPopUps",
                        where: {
                            userId: reqUser.id
                        },
                        required: false
                    }],
                    where: {
                        isView: true
                    },
                    order: [[STD.popUp.defaultOrderBy, STD.common.DESC]]
                }).then(function (data) {
                    if (data) {
                        if (data.userPopUps.length) {
                            throw new errorHandler.CustomSequelizeError(404, {
                                code: ""
                            });
                        } else {
                            loadedData = data;
                            return true;
                        }
                    } else {
                        throw new errorHandler.CustomSequelizeError(404, {
                            code: ""
                        });
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        callback(200, loadedData)
                    }
                });
            },
            'findPopUpsByOptions': function (options, callback) {
                var count = 0;
                var loadedData = 0;
                var where = {};
                var countWhere = {};
                var query = {
                    include: sequelize.models.AppPopUp.getIncludePopUp(),
                    where: where,
                    order: [[options.orderBy, options.sort]],
                    limit: parseInt(options.size)
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
                    var enumSearchFields = STD.popUp.enumSearchFields;
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

                if (options.isView !== undefined) {
                    where.isView = options.isView;
                    countWhere.isView = options.isView;
                }

                sequelize.models.AppPopUp.count({
                    where: countWhere
                }).then(function (data) {
                    if (data > 0) {
                        count = data;
                        return sequelize.models.AppPopUp.findAll(query);
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