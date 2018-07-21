export default function SelectPetCtrl ($scope, $rootScope, metaManager, dialogHandler, petsManager, modalHandler) {
    'ngInject';

    var vm = $scope.vm;
    var COMMON = metaManager.std.common;
    var PET = metaManager.std.pet;
    var TOTAL_PET_GENDER = '전체 성별';
    var TOTAL_PET_SERIES = '전체 종';
    var NO_PET_SERIES = '품종 미입력';
    var TOTAL_VACCINATION = '접종 여부';
    var VACCINATION1 = '1차 완료';
    var VACCINATION2 = '2차 완료';
    var VACCINATION3 = '3차 완료';
    var TOTAL_NEUTER = '중성화 여부';
    var NEUTER_TRUE = '중성화 했음';
    var NEUTER_FALSE = '중성화 안함';
    var $target = $('#select-pet-wrap');
    var eventKey = null;

    var defaultForm = {
        orderBy: PET.defaultOrderBy,
        sort: COMMON.ASC,
        searchField: PET.enumSearchFields[0],
        petGender: TOTAL_PET_GENDER,
        petSeries: TOTAL_PET_SERIES,
        vaccination: TOTAL_VACCINATION,
        neuter: TOTAL_NEUTER
    };

    $scope.close = close;
    $scope.findPets = findPets;
    $scope.selectPet = selectPet;
    $scope.reload = reload;

    $scope.enumPetGenders = [TOTAL_PET_GENDER].concat(PET.enumPetGenders);
    $scope.enumPetSeries = [TOTAL_PET_SERIES];
    $scope.enumVaccinations = [TOTAL_VACCINATION, VACCINATION1, VACCINATION2, VACCINATION3];
    $scope.enumNeuters = [TOTAL_NEUTER, NEUTER_TRUE, NEUTER_FALSE];

    $scope.isOpen = false;
    $scope.isFilter = false;
    $scope.more = false;
    $scope.form = angular.copy(defaultForm);
    $scope.pets = {
        count: 0,
        rows: []
    };

    modalHandler.eventBind($target, function () {
        vm.apply(function () {
            close();
        });
    });

    $scope.$on('select-pet', function (event, args) {
        if (args.eventKey) {
            openModal(args.eventKey, args.isFilter);
        }
    });

    $scope.$watch('form.petSeries', function (n, o) {
        if (n != o) {
            reload();
        }
    }, true);

    $scope.$watch('form.petGender', function (n, o) {
        if (n != o) {
            reload();
        }
    }, true);

    $scope.$watch('form.vaccination', function (n, o) {
        if (n != o) {
            reload();
        }
    }, true);

    $scope.$watch('form.neuter', function (n, o) {
        if (n != o) {
            reload();
        }
    }, true);

    function reload () {
        findPets(true);
    }

    function findPets (refresh) {
        var offset = null;
        if (refresh) {
            // $scope.pets = {
            //     count: 0,
            //     rows: []
            // };
        } else {
            offset = $scope.pets.rows.length;
        }
        var query = angular.copy($scope.form);
        if (query.petGender == TOTAL_PET_GENDER) delete query.petGender;
        if (query.petSeries == TOTAL_PET_SERIES) {
            delete query.petSeries;
        } else if (query.petSeries == NO_PET_SERIES) {
            query.petSeries = null;
        }
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
                    $scope.pets = data;
                } else {
                    $scope.pets.rows = $scope.pets.rows.concat(data.rows);
                }
                $scope.more = $scope.pets.rows.length < $scope.pets.count;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function findPetSeries () {
        petsManager.findPetSeries({}, function (status, data) {
            if (status == 200) {
                data.forEach(function (item) {
                    $scope.enumPetSeries.push(item.petSeries ? item.petSeries : NO_PET_SERIES);
                });
            }
        });
    }

    function selectPet (pet) {
        $rootScope.$broadcast(eventKey, {
            pet: angular.copy(pet || null)
        });
        close();
    }

    function openModal (key, isFilter) {
        if (!$scope.pets.rows.length) {
            findPetSeries();
            findPets(true);
        }
        $scope.isOpen = true;
        $scope.isFilter = !!isFilter;
        modalHandler.focus($target);
        eventKey = key;
    }

    function close () {
        $scope.isOpen = false;
        eventKey = null;
    }
}