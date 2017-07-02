export default function MainCtrl($rootScope, $scope, $location, $filter, metaManager, sessionManager, statusHandler, loadingHandler, dialogHandler, navigator, backgroundsManager) {
    'ngInject';

    var vm = $scope.vm = {};
    var STD = metaManager.std;
    statusHandler.init(vm);
    loadingHandler.init(vm);
    dialogHandler.init(vm);
    vm.translate = $filter('translate');
    vm.session = sessionManager.session;
    vm.COMMON = STD.common;
    vm.USER = STD.user;
    vm.BACKGROUND = STD.background;
    vm.PET = STD.pet;
    vm.TREATMENT = STD.treatment;
    vm.templatePath = STD.templatePath;
    vm.defaultLoadingLength = vm.COMMON.defaultLoadingLength;

    vm.currentPage = currentPage;
    vm.isLoggedIn = isLoggedIn;
    vm.logout = logout;
    vm.toggleClose = toggleClose;

    vm.currentNav = {};
    vm.isNavOpen = false;
    vm.backgroundInstance = {
        login: null,
        signUp: null,
        pet: null,
        meal: null,
        treatment: null,
        poo: null,
        report: null
    };
    vm.backgroundReady = false;
    vm.backgrounds = {
        all: [],
        login: [],
        signUp: [],
        pet: [],
        meal: [],
        treatment: [],
        poo: [],
        report: []
    };

    init();

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

    function init () {
        backgroundsManager.findBackgrounds({
            isUse: true
        }, function (status, data) {
            if (status == 200) {
                data.rows.forEach(function (background) {
                    vm.backgrounds[background.type].push(background.image);
                });
                vm.backgroundReady = true;
            }
        });
    }

    $scope.$on("core.session.callback", function (event, args) {
        if (args.type == 'signup') {
            vm.session = sessionManager.session;
            navigator.goToIndex();
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