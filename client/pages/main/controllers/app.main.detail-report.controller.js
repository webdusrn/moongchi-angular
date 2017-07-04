export default function DetailReportCtrl ($scope, reportsManager) {
    'ngInject';

    var vm = $scope.vm;

    $scope.ready = false;
    $scope.report = angular.copy($scope.modal.detail.report);

    if ($scope.report) {
        reportsManager.findReportById($scope.report.id, function (status, data) {
            if (status == 200) {
                $scope.ready = true;
            } else {
                $scope.modal.detail = false;
            }
        });
    }
}