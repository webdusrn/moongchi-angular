export default function AddReportCtrl ($scope, $element, reportsManager, dialogHandler) {
    'ngInject';
    var vm = $scope.vm;

    $scope.addReport = addReport;
    $scope.inputFocus = inputFocus;
    $scope.inputBlur = inputBlur;

    $scope.focus = {
        body: false
    };
    $scope.form = {
        email: vm.session.email
    };

    function addReport () {
        var body = angular.copy($scope.form);
        if (!body.body) {
            focusObject($('#add-report-body'));
            return dialogHandler.show(false, vm.translate("wrongReportBody"), false, true);
        }
        reportsManager.createReport(body, function (status, data) {
            if (status == 201) {
                $scope.addReportSuccess(data);
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function inputFocus (key) {
        $scope.focus[key] = true;
    }

    function inputBlur (key) {
        $scope.focus[key] = false;
    }

    function focusObject ($object) {
        $object.focus();
        $object.focusin();
    }

    $element.bind('keydown', function (e) {
        var keyCode = (e.keyCode ? e.keyCode : e.which);

        switch (keyCode) {
            case 27:
                if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
                    $scope.modal.add = false;
                } else {
                    $scope.$apply(function () {
                        $scope.modal.add = false;
                    });
                }
                break;
        }
    });
}