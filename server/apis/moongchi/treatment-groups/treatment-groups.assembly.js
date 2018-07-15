var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var gets = require('./' + resource + '.gets.js');
var get = require('./' + resource + '.get.js');
var put = require('./' + resource + '.put.js');
var post = require('./' + resource + '.post.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    get : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains : {
                    'id': '데이터를 얻을 리소스의 id'
                },
                param: 'id',
                title: '단일 얻기',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(get.validate());
                apiCreator.add(get.setParam());
                apiCreator.add(get.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    },
    gets : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: [
                    "searchField",
                    "searchItem",
                    "orderBy",
                    "sort",
                    "last",
                    "size",
                    "offset",
                    "treatmentType",
                    "petId"
                ],
                essential: [],
                resettable: [],
                explains : {
                    "searchField": "검색 필드 " + STD.treatmentGroup.enumSearchFields.join(', '),
                    "searchItem": "검색어",
                    "orderBy": "정렬 기준 " + STD.treatmentGroup.enumOrderBys.join(', '),
                    "sort": "정렬 방식 " + STD.common.enumSortTypes.join(', '),
                    "last": "마지막 데이터",
                    "size": "가져올 데이터수",
                    "offset": "offset",
                    "treatmentType": "진료 유형 " + STD.treatment.enumTreatmentTypes.join(', '),
                    "petId": "PET ID"
                },
                title: '조회',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(gets.validate());
                apiCreator.add(gets.setParam());
                apiCreator.add(gets.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    },
    post : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: [
                    'hospitalName',
                    'treatmentAt',
                    'treatmentTotalPrice',

                    'petIds',
                    'treatmentTypes',
                    'treatmentPrices',
                    'treatmentMemos'
                ],
                essential: [
                    'petIds',
                    'treatmentTypes',
                    'treatmentPrices',
                    'treatmentMemos'
                ],
                resettable: [],
                explains : {
                    'hospitalName': '병원이름',
                    'treatmentAt': '진료일자 (yyyy-MM-dd)',
                    'treatmentTotalPrice': '진료비',

                    'petIds': 'petIds',
                    'treatmentTypes': 'treatmentTypes',
                    'treatmentPrices': 'treatmentPrices',
                    'treatmentMemos': 'treatmentMemos'
                },
                title: '생성',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(post.validate());
                apiCreator.add(post.validateDate());
                apiCreator.add(post.checkAuthorization());
                apiCreator.add(post.setParam());
                apiCreator.add(post.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    },
    put : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: [
                    'hospitalName',
                    'treatmentAt',
                    'treatmentTotalPrice'
                ],
                essential: [],
                resettable: [
                    'hospitalName',
                    'treatmentAt',
                    'treatmentTotalPrice'
                ],
                explains : {
                    'id': 'TREATMENT GROUP ID',
                    'hospitalName': '병원이름',
                    'treatmentAt': '진료일자 (yyyy-MM-dd)',
                    'treatmentTotalPrice': '진료비'
                },
                title: '수정',
                param: 'id',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(put.validate());
                apiCreator.add(put.dateValidate());
                apiCreator.add(put.checkAuthorization());
                apiCreator.add(put.setParam());
                apiCreator.add(put.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    },
    delete : function(isOnlyParams) {
        return function(req, res, next) {
            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains : {
                    'id': 'TREATMENT GROUP ID',
                },
                title: '제거',
                param: 'id',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedIn());
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(del.validate());
                apiCreator.add(del.checkAuthorization());
                apiCreator.add(del.destroy());
                apiCreator.add(del.supplement());
                apiCreator.run();

                
            }
            else {
                return params;
            }
        };
    }
};

router.get('/' + resource + '/:id', api.get());
router.get('/' + resource, api.gets());
router.post('/' + resource, api.post());
router.put('/' + resource + '/:id', api.put());
router.delete('/' + resource + '/:id', api.delete());

module.exports.router = router;
module.exports.api = api;