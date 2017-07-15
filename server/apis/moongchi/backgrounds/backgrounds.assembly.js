var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var gets = require('./' + resource + '.gets.js');

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
    }
};

router.get('/' + resource, api.gets());

module.exports.router = router;
module.exports.api = api;