export default function NavigationCtrl ($scope, navigator) {
    'ngInject';
    var vm = $scope.vm;

    $scope.goTo = goTo;

    function goTo (key) {
        vm.isNavOpen = false;
        navigator.goTo(key);
    }
}