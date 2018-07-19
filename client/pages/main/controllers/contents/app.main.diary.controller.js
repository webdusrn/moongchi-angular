export default function DiaryCtrl ($scope, $rootScope, $state, navigationConstant, dialogHandler, loadingHandler, metaManager, diariesManager) {
    'ngInject';

    var vm = $scope.vm;
    var DIARY = metaManager.std.diary;
    var currentNav = $state.current.name;
    var TOTAL_DIARY_TYPE = '전체 항목';

    vm.setNav(currentNav);

    $scope.createDiary = createDiary;
    $scope.findDiaries = findDiaries;

    $scope.enumDiaryTypes = [TOTAL_DIARY_TYPE].concat(DIARY.enumDiaryTypes);
    $scope.currentNav = currentNav;
    $scope.navigationConstant = navigationConstant;

    $scope.more = false;
    $scope.diaries = {
        count: 0,
        rows: []
    };
    $scope.form = {
        diaryType: TOTAL_DIARY_TYPE
    };

    vm.getSession(function () {
        findDiaries(true);
    });

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
    
    function createDiary () {

    }
}