export default function AddReportCtrl ($scope, reportsManager, dialogHandler) {
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
            focusKey();
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

    function focusKey (key) {
        var $key = $(key);
        $key.focus();
        $key.focusin();
    }
}