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
                role: STD.user.roleAdmin,
                param: 'id',
                title: '단일 얻기',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.user.roleAdmin));
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
                    "orderBy",
                    "sort",
                    "last",
                    "size",
                    "offset",
                    "isUse",
                    "type"
                ],
                essential: [],
                resettable: [],
                explains : {
                    "orderBy": "정렬 기준 " + STD.background.enumOrderBys.join(', '),
                    "sort": "정렬 방식 " + STD.common.enumSortTypes.join(', '),
                    "last": "정렬 기준 마지막 데이터",
                    "size": "가져올 데이터 갯수",
                    "offset": "offset",
                    "isUse": "사용 여부 (true / false)",
                    "type": "배경 유형 " + STD.background.enumTypes.join(', ')
                },
                role: STD.user.roleAdmin,
                title: '조회',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.user.roleAdmin));
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
                    "imageId",
                    "isUse",
                    "type"
                ],
                essential: [
                    "imageId",
                ],
                resettable: [],
                explains : {
                    "imageId": "이미지 ID",
                    "isUse": "이용 여부 (true, false)",
                    "type": "배경 유형 " + STD.background.enumTypes.join(', ')
                },
                role: STD.user.roleAdmin,
                title: '생성',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.user.roleAdmin));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(post.validate());
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
                    "imageId",
                    "isUse",
                    "type"
                ],
                essential: [],
                resettable: [],
                explains : {
                    "imageId": "이미지 ID",
                    "isUse": "이용 여부 (true, false)",
                    "type": "배경 유형 " + STD.background.enumTypes.join(', ')
                },
                role: STD.user.roleAdmin,
                title: '수정',
                param: 'id',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.user.roleAdmin));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(put.validate());
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
                    'id': '데이터 리소스의 id'
                },
                role: STD.user.roleAdmin,
                title: '제거',
                param: 'id',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.session.loggedInRole(STD.user.roleAdmin));
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(del.validate());
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