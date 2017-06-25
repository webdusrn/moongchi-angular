export default function NavigationCtrl ($scope) {
    'ngInject';
    var vm = $scope.vm;

    $scope.toggleClose = toggleClose;

    function toggleClose () {
        vm.isNavOpen = false;
    }
}