export default function HeaderCtrl ($scope, navigator) {
    'ngInject';
    var vm = $scope.vm;

    $scope.goToLogin = goToLogin;
    $scope.goToIndex = goToIndex;
    $scope.logout = logout;

    function goToLogin () {
        navigator.goToLogin();
    }

    function goToIndex () {
        navigator.goToIndex();
    }

    function logout () {
        vm.logout();
    }
}