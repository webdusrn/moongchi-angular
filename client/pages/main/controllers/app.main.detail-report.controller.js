export default function DetailReportCtrl ($scope, $element, reportsManager) {
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

    function focusObject ($object) {
        $object.focus();
        $object.focusin();
    }

    focusObject($element);
    $element.bind('keydown', function (e) {
        var keyCode = (e.keyCode ? e.keyCode : e.which);

        switch (keyCode) {
            case 27:
                if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
                    $scope.modal.detail = false;
                } else {
                    $scope.$apply(function () {
                        $scope.modal.detail = false;
                    });
                }
                break;
        }
    });
}