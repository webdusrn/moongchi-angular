export default function TreatmentCtrl ($scope, $state, navigationConstant, metaManager, dialogHandler, loadingHandler, treatmentsManager) {
    'ngInject';

    var vm = $scope.vm;
    var currentNav = $state.current.name;

    vm.setNav(currentNav);

    $scope.createTreatmentGroup = createTreatmentGroup;

    $scope.currentNav = currentNav;
    $scope.navigationConstant = navigationConstant;

    $scope.more = false;
    $scope.treatmentGroups = {
        count: 0,
        rows: []
    };
    $scope.form = {};

    vm.getSession(function () {
        findTreatmentGroups(true);
    });

    function findTreatmentGroups (refresh) {
        var offset = null;
        if (refresh) {
            $scope.treatmentGroups = {
                count: 0,
                rows: []
            };
        } else {
            offset = $scope.treatmentGroups.rows.length;
        }
        var query = angular.copy($scope.form);
        if (offset) query.offset = offset;
        treatmentsManager.findTreatmentGroups(query, function (status, data) {
            if (status == 200) {
                if (refresh) {
                    $scope.treatmentGroups = data;
                } else {
                    $scope.treatmentGroups.rows = $scope.treatmentGroups.rows.concat(data.rows);
                }
                $scope.more = $scope.treatmentGroups.rows.length < $scope.treatmentGroups.count;
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function createTreatmentGroup () {

    }
}