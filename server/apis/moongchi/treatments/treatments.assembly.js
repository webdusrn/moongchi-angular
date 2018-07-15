var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var put = require('./' + resource + '.put.js');
var post = require('./' + resource + '.post.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');


const META = require('../../../../../bridge/metadata');
const STD = META.std;

var api = {
    post : function(isOnlyParams) {
        return function(req, res, next) {

            var params = {
                acceptable: [
                    'treatmentGroupId',
                    'petId',
                    'treatmentType',
                    'treatmentPrice',
                    'treatmentMemo'
                ],
                essential: [
                    'treatmentGroupId',
                    'petId',
                    'treatmentType'
                ],
                resettable: [],
                explains : {
                    'treatmentGroupId': '진료 그룹 ID',
                    'petId': 'PET ID',
                    'treatmentType': '진료유형 ' + STD.treatment.enumTreatmentTypes.join(', '),
                    'treatmentPrice': '진료비',
                    'treatmentMemo': '진료내용'
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
                    'petId',
                    'treatmentType',
                    'treatmentPrice',
                    'treatmentMemo'
                ],
                essential: [],
                resettable: [
                    'treatmentPrice',
                    'treatmentMemo'
                ],
                explains : {
                    'id': 'TREATMENT ID',
                    'petId': 'PET ID',
                    'treatmentType': '진료유형 ' + STD.treatment.enumTreatmentTypes.join(', '),
                    'treatmentPrice': '진료비',
                    'treatmentMemo': '진료내용'
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
                apiCreator.add(put.checkPetAuthorization());
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
                    'id': 'TREATMENT ID',
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

router.post('/' + resource, api.post());
router.put('/' + resource + '/:id', api.put());
router.delete('/' + resource + '/:id', api.delete());

module.exports.router = router;
module.exports.api = api;