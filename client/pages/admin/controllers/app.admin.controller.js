export default function AdminCtrl ($scope, $filter, loadingHandler, dialogHandler, sessionManager, metaManager, navigator) {
    "ngInject";

    var vm = $scope.vm = {};
    var STD = metaManager.std;
    loadingHandler.init(vm);
    dialogHandler.init(vm);
    vm.translate = $filter('translate');
    vm.session = sessionManager.session;
    vm.COMMON = STD.common;
    vm.USER = STD.user;
    vm.templatePath = STD.templatePath;
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
        return (vm.session && vm.session.id && vm.session.role >= STD.user.roleAdmin);
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
        if (args.type == 'login') {
            vm.session = sessionManager.session;
            navigator.goToIndex();
        } else if (args.type == 'findPass') {

        } else if (args.type == 'changePass') {

        }
    });

    $scope.$on("$locationChangeSuccess", function (e, next, current) {
        if (!isLoggedIn()) {
            navigator.goToLogin();
        }
    });
}