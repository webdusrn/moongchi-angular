export default function MainCtrl($rootScope, $scope, $location, $filter, metaManager, sessionManager, statusHandler, navigator) {
    'ngInject';

    var vm = $scope.vm = {};
    statusHandler.init(vm);
    vm.translate = $filter('translate');
    vm.session = sessionManager.session;
    vm.COMMON = metaManager.std.common;
    vm.defaultLoadingLength = vm.COMMON.defaultLoadingLength;

    vm.currentPage = currentPage;
    vm.isLoggedIn = isLoggedIn;
    vm.logout = logout;

    vm.currentNav = {};

    function currentPage (page) {
        vm.currentNav = {};
        vm.currentNav[page] = true;
    }

    function isLoggedIn () {
        return (vm.session && vm.session.id);
    }

    function logout () {
        sessionManager.logout(function (status) {
            if (status == 204) {
                vm.session = null;
                navigator.goToLogin();
            }
        });
    }

    $scope.$on("core.session.callback", function (event, args) {
        if (args.type == 'signup') {
            vm.session = sessionManager.session;

        } else if (args.type == 'login') {
            vm.session = sessionManager.session;
            navigator.goToIndex();
        } else if (args.type == 'findPass') {

        } else if (args.type == 'changePass') {

        }
    });

    $scope.$watch('vm.session', function (newVal, oldVal) {
        if (newVal != oldVal) {
            if (!vm.session || !vm.session.id) {
                navigator.goToLogin();
            }
        }
    }, true);

    $scope.$on("$locationChangeSuccess", function (e, next, current) {
        if (!vm.session || !vm.session.id) {
            navigator.goToLogin();
        }
    });
}