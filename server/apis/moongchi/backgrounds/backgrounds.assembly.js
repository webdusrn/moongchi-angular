var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var gets = require('./' + resource + '.gets.js');
var post = require('./' + resource + '.post.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    gets : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: [
                    "isUse",
                    "types"
                ],
                essential: [],
                resettable: [],
                explains : {
                    "isUse": "사용 체크 (true, false)",
                    "types": "배경 타입 (,)로 구분 " + STD.background.enumTypes.join(', ')
                },
                title: '조회',
                state: 'design'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

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
                apiCreator.add(post.supplement());
                apiCreator.run();


            }
            else {
                return params;
            }
        };
    },
};

router.get('/' + resource, api.gets());
router.post('/' + resource, api.post());

module.exports.router = router;
module.exports.api = api;