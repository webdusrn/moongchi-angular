export default function HeaderCtrl ($scope, navigator) {
    'ngInject';
    var vm = $scope.vm;

    $scope.toggle = toggle;

    function toggle () {
        vm.isNavOpen = !vm.isNavOpen;
    }
}