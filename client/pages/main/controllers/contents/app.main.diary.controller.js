export default function DiaryCtrl ($scope, $state, navigationConstant, dialogHandler, loadingHandler, diariesManager) {
    'ngInject';

    var vm = $scope.vm;
    var currentNav = $state.current.name;

    vm.setNav(currentNav);

    $scope.createDiary = createDiary;

    $scope.currentNav = currentNav;
    $scope.navigationConstant = navigationConstant;

    $scope.more = false;
    $scope.diaries = {
        count: 0,
        rows: []
    };
    $scope.form = {
        
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