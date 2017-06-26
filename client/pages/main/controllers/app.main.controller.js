export default function MainCtrl($rootScope, $scope, $location, $filter, metaManager, sessionManager, statusHandler, loadingHandler, dialogHandler, navigator) {
    'ngInject';

    var vm = $scope.vm = {};
    statusHandler.init(vm);
    loadingHandler.init(vm);
    dialogHandler.init(vm);
    vm.translate = $filter('translate');
    vm.session = sessionManager.session;
    vm.COMMON = metaManager.std.common;
    vm.templatePath = metaManager.std.templatePath;
    vm.defaultLoadingLength = vm.COMMON.defaultLoadingLength;

    vm.currentPage = currentPage;
    vm.isLoggedIn = isLoggedIn;
    vm.logout = logout;
    vm.toggleClose = toggleClose;

    vm.currentNav = {};
    vm.isNavOpen = false;

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

    function toggleClose () {
        vm.isNavOpen = false;
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

    $scope.$on("$locationChangeSuccess", function (e, next, current) {
        if ((!vm.session || !vm.session.id) &&
            next.indexOf("sign-up") == -1 &&
            next.indexOf("find-pass") == -1) {
            navigator.goToLogin();
        }
    });
}