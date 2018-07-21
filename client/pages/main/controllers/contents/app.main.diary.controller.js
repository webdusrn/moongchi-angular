export default function DiaryCtrl ($scope, $rootScope, $state, $stateParams, navigationConstant, dialogHandler, loadingHandler, metaManager, diariesManager, petsManager, appNavigator) {
    'ngInject';

    var vm = $scope.vm;
    var DIARY = metaManager.std.diary;
    var currentNav = $state.current.name;
    var TOTAL_DIARY_TYPE = '전체 항목';
    var selectedIndex = null;

    var defaultForm = {
        orderBy: DIARY.defaultOrderBy,
        sort: vm.COMMON.DESC,
        diaryType: TOTAL_DIARY_TYPE
    };

    vm.setNav(currentNav);

    $scope.createDiary = createDiary;
    $scope.findDiaries = findDiaries;
    $scope.reload = reload;
    $scope.openDetailDiary = openDetailDiary;

    $scope.enumDiaryTypes = [TOTAL_DIARY_TYPE].concat(DIARY.enumDiaryTypes);
    $scope.currentNav = currentNav;
    $scope.navigationConstant = navigationConstant;
    $scope.selectedPet = null;

    $scope.more = false;
    $scope.diaries = {
        count: 0,
        rows: []
    };
    $scope.form = {
        orderBy: DIARY.defaultOrderBy,
        sort: vm.COMMON.DESC,
        diaryType: $stateParams.diaryType || TOTAL_DIARY_TYPE,
        petId: $stateParams.petId || null
    };

    vm.getSession(function () {
        findDiaries(true);
        findPet($scope.form.petId);
    });

    $scope.$on('create-diary', function (event, args) {
        reload(true);
    });

    $scope.$on('update-diary', function (event, args) {
        findDiary($scope.diaries.rows[selectedIndex], function (diary) {
            $scope.diaries.rows[selectedIndex] = diary;
        });
    });

    $scope.$on('delete-diary', function (event, args) {
        $scope.diaries.count--;
        $scope.diaries.rows.splice(selectedIndex, 1);
    });

    $scope.$watch('form.diaryType', function (n, o) {
        if (n != o) {
            reload();
        }
    }, true);

    function findDiaries (refresh) {
        var offset = null;
        if (refresh) {
            $scope.diaries = {
                count: 0,
                rows: []
            };
        } else {
            offset = $scope.diaries.rows.length;
        }
        var query = angular.copy($scope.form);
        if (query.diaryType == TOTAL_DIARY_TYPE) delete query.diaryType;
        if (offset) query.offset = offset;
        diariesManager.findDiaries(query, function (status, data) {
            if (status == 200) {
                if (refresh) {
                    $scope.diaries = data;
                } else {
                    $scope.diaries.rows = $scope.diaries.rows.concat(data.rows);
                }
                $scope.more = $scope.diaries.rows.length < $scope.diaries.count;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function reload (refresh) {
        appNavigator.goToDiary(angular.copy(refresh ? defaultForm : $scope.form), true);
    }

    function findDiary (target, callback) {
        diariesManager.findDiary(target.id, function (status, data) {
            if (status == 200) {
                callback(data);
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function findPet (petId) {
        if (petId) {
            petsManager.findPet(petId, function (status, data) {
                if (status == 200) {
                    $scope.selectedPet = data;
                    petWatch();
                } else {
                    dialogHandler.alertError(status, data);
                }
            });
        } else {
            petWatch();
        }
    }

    function petWatch () {
        $scope.$watch('selectedPet', function (n, o) {
            if (n != o) {
                if (n) {
                    $scope.form.petId = n.id;
                } else {
                    $scope.form.petId = null;
                }
                reload();
            }
        });
    }

    function openDetailDiary (diary, index) {
        selectedIndex = index;
        $rootScope.$broadcast('open-detail-diary', {
            diary: diary
        });
    }
    
    function createDiary () {
        $rootScope.$broadcast('open-create-diary', {});
    }
}