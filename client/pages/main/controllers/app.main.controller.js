export default function MainCtrl($rootScope, $scope, $location, $filter, metaManager, FileUploader, sessionManager, statusHandler, loadingHandler, dialogHandler, appNavigator, backgroundsManager) {
    'ngInject';

    var vm = $scope.vm = {};
    var STD = metaManager.std;
    statusHandler.init(vm);
    loadingHandler.init(vm);
    dialogHandler.init(vm);

    vm.translate = $filter('translate');
    vm.session = sessionManager.session;
    vm.FILE = STD.file;
    vm.COMMON = STD.common;
    vm.USER = STD.user;
    vm.BACKGROUND = STD.background;
    vm.templatePath = STD.templatePath;
    vm.defaultLoadingLength = vm.COMMON.defaultLoadingLength;

    FileUploader.FileSelect.prototype.isEmptyAfterSelection = function () {
        return true;
    };
    vm.FileUploader = FileUploader;

    vm.setNav = setNav;
    vm.isLoggedIn = isLoggedIn;
    vm.getSession = getSession;
    vm.logout = logout;
    vm.toggleClose = toggleClose;
    vm.apply = apply;

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

    function setNav (page) {
        vm.currentNav = {};
        vm.currentNav[page] = true;
    }

    function isLoggedIn () {
        return (vm.session && vm.session.id);
    }

    function getSession (successCallback, failCallback) {
        sessionManager.getSession(function (status, data) {
            if (status == 200) {
                if (successCallback) successCallback();
            } else {
                if (failCallback) failCallback();
                appNavigator.goToLogin();
            }
        });
    }

    function logout () {
        sessionManager.logout(function (status) {
            if (status == 204) {
                vm.session = null;
                appNavigator.goToLogin();
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

    function apply (callback) {
        if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
            callback();
        } else {
            $scope.$apply(function () {
                callback();
            });
        }
    }

    $scope.$on("core.session.callback", function (event, args) {
        if (args.type == 'signup') {
            vm.session = sessionManager.session;
            appNavigator.goToIndex();
        } else if (args.type == 'login') {
            vm.session = sessionManager.session;
            appNavigator.goToIndex();
        } else if (args.type == 'findPass') {

        } else if (args.type == 'changePass') {

        }
    });

    $scope.$on("$locationChangeSuccess", function (e, next, current) {
        if ((!vm.session || !vm.session.id) &&
            next.indexOf("sign-up") == -1 &&
            next.indexOf("find-pass") == -1) {
            appNavigator.goToLogin();
        }
    });
}