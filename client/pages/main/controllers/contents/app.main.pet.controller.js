export default function petCtrl ($scope, $rootScope, $state, $stateParams, navigationConstant, metaManager, dialogHandler, petsManager, loadingHandler, appNavigator) {
    'ngInject';

    var vm = $scope.vm;
    var PET = metaManager.std.pet;
    var currentNav = $state.current.name;
    var TOTAL_PET_GENDER = '전체 성별';
    var TOTAL_PET_SERIES = '전체 종';
    var TOTAL_VACCINATION = '접종 여부';
    var VACCINATION1 = '1차 완료';
    var VACCINATION2 = '2차 완료';
    var VACCINATION3 = '3차 완료';
    var TOTAL_NEUTER = '중성화 여부';
    var NEUTER_TRUE = '중성화 했음';
    var NEUTER_FALSE = '중성화 안함';
    var selectedIndex = null;

    var defaultForm = {
        orderBy: PET.defaultOrderBy,
        sort: vm.COMMON.ASC,
        searchField: PET.enumSearchFields[0],
        petGender: TOTAL_PET_GENDER,
        petSeries: TOTAL_PET_SERIES,
        vaccination: TOTAL_VACCINATION,
        neuter: TOTAL_NEUTER
    };

    vm.setNav(currentNav);

    $scope.findPets = findPets;
    $scope.reload = reload;
    $scope.createPet = createPet;
    $scope.openDetailPet = openDetailPet;

    $scope.enumOrderBys = PET.enumOrderBys;
    $scope.enumPetGenders = [TOTAL_PET_GENDER].concat(PET.enumPetGenders);
    $scope.enumPetSeries = [TOTAL_PET_SERIES];
    $scope.enumVaccinations = [TOTAL_VACCINATION, VACCINATION1, VACCINATION2, VACCINATION3];
    $scope.enumNeuters = [TOTAL_NEUTER, NEUTER_TRUE, NEUTER_FALSE];
    $scope.currentNav = currentNav;
    $scope.navigationConstant = navigationConstant;

    $scope.pets = {
        count: 0,
        rows: []
    };
    $scope.more = false;
    $scope.form = {
        orderBy: PET.defaultOrderBy,
        sort: vm.COMMON.ASC,
        searchField: PET.enumSearchFields[0],
        searchItem: $stateParams.searchItem,
        petGender: $stateParams.petGender || TOTAL_PET_GENDER,
        petSeries: $stateParams.petSeries || TOTAL_PET_SERIES,
        vaccination: $stateParams.vaccination || TOTAL_VACCINATION,
        neuter: $stateParams.neuter || TOTAL_NEUTER
    };

    vm.getSession(function () {
        findPetSeries();
        findPets(true);
    });

    $scope.$on('create-pet', function (event, args) {
        reload(true);
    });

    $scope.$on('update-pet', function (event, args) {
        findPet($scope.pets.rows[selectedIndex], function (pet) {
            $scope.pets.rows[selectedIndex] = pet;
        });
    });

    $scope.$on('delete-pet', function (event, args) {
        $scope.pets.count--;
        $scope.pets.rows.splice(selectedIndex, 1);
    });

    $scope.$watch('form.petGender', function (n, o) {
        if (n != o) {
            reload();
        }
    }, true);

    $scope.$watch('form.petSeries', function (n, o) {
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

    function findPets (refresh) {
        var offset = null;
        if (refresh) {
            $scope.pets = {
                count: 0,
                rows: []
            };
        } else {
            offset = $scope.pets.rows.length;
        }
        var query = angular.copy($scope.form);
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

    function reload (refresh) {
        appNavigator.goToPet(angular.copy(refresh ? defaultForm : $scope.form), true);
    }

    function findPetSeries () {
        petsManager.findPetSeries({}, function (status, data) {
            if (status == 200) {
                data.forEach(function (item) {
                    $scope.enumPetSeries.push(item.petSeries);
                });
            }
        });
    }

    function findPet (target, callback) {
        petsManager.findPet(target.id, function (status, data) {
            if (status == 200) {
                callback(data);
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function openDetailPet (pet, index) {
        selectedIndex = index;
        $rootScope.$broadcast('open-detail-pet', {
            pet: pet
        });
    }

    function createPet () {
        $rootScope.$broadcast('open-create-pet', {});
    }
}