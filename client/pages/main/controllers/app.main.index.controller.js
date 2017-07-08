export default function IndexCtrl ($scope, popUpsManager, dialogHandler) {
    "ngInject";
    var vm = $scope.vm;

    vm.currentPage("index");

    $scope.popUp = null;

    if (vm.isLoggedIn()) {
        findPopUp();
    }

    function findPopUp () {
        popUpsManager.findCurrentPopUp(function (status, data) {
            if (status == 200) {
                $scope.popUp = data;
            } else if (status != 404) {
                dialogHandler.alertError(status, data);
            }
        });
    }

    $scope.$on('app.pop-up-close', function (event, args) {
        $scope.popUp = null;
    });
}