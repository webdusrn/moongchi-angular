export default function IndexCtrl ($scope, dialogHandler) {
    "ngInject";
    var vm = $scope.vm;

    vm.setNav("index");

    vm.getSession(function () {

    });
}