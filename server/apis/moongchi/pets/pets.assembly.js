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
                    "petGender",
                    "petSeries",
                    "vaccination",
                    "neuter"
                ],
                essential: [],
                resettable: [],
                explains : {
                    "searchField": "검색 필드 " + STD.pet.enumSearchFields.join(', '),
                    "searchItem": "검색어",
                    "orderBy": "정렬 기준 " + STD.pet.enumOrderBys.join(', '),
                    "sort": "정렬 방식 " + STD.common.enumSortTypes.join(', '),
                    "last": "마지막 데이터",
                    "size": "가져올 데이터수",
                    "offset": "offset",
                    "petGender": "성별 " + STD.pet.enumPetGenders.join(', '),
                    "petSeries": "펫 종 " + STD.pet.enumCatSeries.join(', '),
                    "vaccination": "접종 완료 여부 (1, 2, 3)",
                    "neuter": "중성화 여부 (true / false)"
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
                    'petType',
                    'petSeries',
                    'petGender',
                    'petName',
                    'birthAt',
                    'isVaccination1',
                    'isVaccination2',
                    'isVaccination3',
                    'isNeuter'
                ],
                essential: [
                    'petName'
                ],
                resettable: [],
                explains : {
                    'petType': '펫 유형 ' + STD.pet.enumPetTypes.join(', '),
                    'petSeries': '펫 종',
                    'petGender': '펫 성별 ' + STD.pet.enumPetGenders.join(', '),
                    'petName': '펫 이름',
                    'birthAt': '생일 (yyyy-MM-dd)',
                    'isVaccination1': '1차 예방접종 여부',
                    'isVaccination2': '2차 예방접종 여부',
                    'isVaccination3': '3차 예방접종 여부',
                    'isNeuter': '중상화 여부'
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
                apiCreator.add(post.setParam());
                apiCreator.add(post.dateValidate());
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
                    'petSeries',
                    'petName',
                    'petGender',
                    'birthAt',
                    'isVaccination1',
                    'isVaccination2',
                    'isVaccination3',
                    'isNeuter',
                    'imageId'
                ],
                essential: [
                    'isVaccination1',
                    'isVaccination2',
                    'isVaccination3',
                    'isNeuter'
                ],
                resettable: [
                    'petSeries',
                    'petGender',
                    'birthAt',
                    'imageId'
                ],
                explains : {
                    'id': 'PET ID',
                    'petSeries': '펫 종',
                    'petGender': '펫 성별 ' + STD.pet.enumPetGenders.join(', '),
                    'petName': '펫 이름',
                    'birthAt': '생일 (yyyy-MM-dd)',
                    'isVaccination1': '1차 예방접종 여부',
                    'isVaccination2': '2차 예방접종 여부',
                    'isVaccination3': '3차 예방접종 여부',
                    'isNeuter': '중상화 여부',
                    'imageId': '대표 이미지'
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
                apiCreator.add(put.findTreatments());
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
                    'id': 'PET ID',
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