export default function HeaderCtrl ($scope, navigator) {
    'ngInject';
    var vm = $scope.vm;

    $scope.toggle = toggle;
    $scope.logo = logo;

    function toggle () {
        vm.isNavOpen = !vm.isNavOpen;
    }

    function logo () {
        vm.isNavOpen = false;
        navigator.goToIndex();
    }
}