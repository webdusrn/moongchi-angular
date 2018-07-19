export default function selectPet ($rootScope, metaManager, dialogHandler, petsManager, modalHandler) {
    'ngInject';

    var templatePath = metaManager.std.templatePath;
    var COMMON = metaManager.std.common;
    var PET = metaManager.std.pet;
    var TOTAL_PET_GENDER = '전체 성별';
    var TOTAL_PET_SERIES = '전체 종';
    var TOTAL_VACCINATION = '접종 여부';
    var VACCINATION1 = '1차 완료';
    var VACCINATION2 = '2차 완료';
    var VACCINATION3 = '3차 완료';
    var TOTAL_NEUTER = '중성화 여부';
    var NEUTER_TRUE = '중성화 했음';
    var NEUTER_FALSE = '중성화 안함';

    var defaultForm = {
        orderBy: PET.defaultOrderBy,
        sort: COMMON.ASC,
        searchField: PET.enumSearchFields[0],
        petGender: TOTAL_PET_GENDER,
        petSeries: TOTAL_PET_SERIES,
        vaccination: TOTAL_VACCINATION,
        neuter: TOTAL_NEUTER
    };

    return {
        restrict: 'AE',
        scope: {
            ngPet: '='
        },
        templateUrl: templatePath + 'main/directives/select-pet/app.main.select-pet.html',
        link: function (scope, element, attr) {
            var $target = $('#select-pet-wrap');

            scope.close = close;
            scope.openModal = openModal;
            scope.findPets = findPets;
            scope.selectPet = selectPet;
            scope.reload = reload;

            scope.enumPetGenders = [TOTAL_PET_GENDER].concat(PET.enumPetGenders);
            scope.enumPetSeries = [TOTAL_PET_SERIES];
            scope.enumVaccinations = [TOTAL_VACCINATION, VACCINATION1, VACCINATION2, VACCINATION3];
            scope.enumNeuters = [TOTAL_NEUTER, NEUTER_TRUE, NEUTER_FALSE];
            
            scope.isOpen = false;
            scope.more = false;
            scope.form = angular.copy(defaultForm);
            scope.pets = {
                count: 0,
                rows: []
            };

            modalHandler.eventBind($target, function () {
                if ($rootScope.$$phase == '$apply' || $rootScope.$$phase == '$digest') {
                    close();
                } else {
                    $rootScope.$apply(function () {
                        close();
                    });
                }
            });

            function reload () {
                findPets(true);
            }
            
            function findPets (refresh) {
                var offset = null;
                if (refresh) {
                    scope.pets = {
                        count: 0,
                        rows: []
                    };
                } else {
                    offset = scope.pets.rows.length;
                }
                var query = angular.copy(scope.form);
                if (query.petGender == TOTAL_PET_GENDER) delete query.petGender;
                if (query.petSeries == TOTAL_PET_SERIES) delete query.petSeries;
                if (query.vaccination == TOTAL_VACCINATION) {
                    delete query.vaccination;
                } else if (query.vaccination == VACCINATION1) {
                    query.vaccination = 1;
                } else if (query.vaccination == VACCINATION2) {
                    query.vaccination = 2;
                } else if (query.vaccination == VACCINATION3) {
                    query.vaccination = 3;
                }
                if (query.neuter == TOTAL_NEUTER) {
                    delete query.neuter;
                } else {
                    query.neuter = query.neuter == NEUTER_TRUE;
                }
                if (offset) query.offset = offset;
                petsManager.findPets(query, function (status, data) {
                    if (status == 200) {
                        if (refresh) {
                            scope.pets = data;
                        } else {
                            scope.pets.rows = scope.pets.rows.concat(data.rows);
                        }
                        scope.more = scope.pets.rows.length < scope.pets.count;
                    } else if (status == 404) {
                        scope.more = false;
                    } else {
                        dialogHandler.alertError(status, data);
                    }
                });
            }

            function selectPet (pet) {
                scope.ngPet = pet;
                close();
            }

            function openModal () {
                if (!scope.pets.rows.length) {
                    findPets(true);
                }
                scope.isOpen = true;
                modalHandler.focus($target);
            }

            function close () {
                scope.isOpen = false;
            }
        }
    }
}