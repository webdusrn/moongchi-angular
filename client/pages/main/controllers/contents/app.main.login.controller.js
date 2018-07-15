export default function LoginCtrl ($scope, $rootScope, $cookies, $interval, $filter, sessionManager, dialogHandler, appNavigator) {
    "ngInject";
    var vm = $scope.vm;
    var backgroundIndex = 0;

    vm.setNav("login");

    $scope.login = login;
    $scope.inputFocus = inputFocus;
    $scope.inputBlur = inputBlur;
    $scope.findPass = findPass;
    $scope.signUp = signUp;

    $scope.storeText = vm.translate('storeId');

    $scope.active = [true, false];
    $scope.style = [{}, {}];
    $scope.backgrounds = [];

    $scope.form = {
        store: false,
        id: '',
        pw: ''
    };
    $scope.focus = {
        id: false,
        pw: false
    };

    if (vm.backgroundReady) {
        $scope.backgrounds = vm.backgrounds.all.concat(vm.backgrounds.login);
        background();
    } else {
        $scope.$watch('vm.backgroundReady', function (newVal, oldVal) {
            if (newVal != oldVal) {
                $scope.backgrounds = vm.backgrounds.all.concat(vm.backgrounds.login);
                background();
            }
        }, true);
    }

    var temp = $cookies.get("store-id");
    if (temp) {
        $scope.form = JSON.parse(temp);
    }

    function login () {
        if ($scope.form.id && $scope.form.pw) {
            sessionManager.loginWithEmail($scope.form.id, $scope.form.pw, function (status, data) {
                if (status == 200) {
                    if ($scope.form.store) {
                        var temp = angular.copy($scope.form);
                        delete temp.pass;
                        $cookies.remove("store-id");
                        $cookies.put("store-id", JSON.stringify(temp));
                    } else {
                        $cookies.remove("store-id");
                    }
                    $rootScope.$broadcast("core.session.callback", {
                        type: 'login'
                    });
                } else {
                    dialogHandler.alertError(status, data);
                }
            });
        } else {
            if (!$scope.form.id) {
                var $loginInputId = $('#login-input-id');
                $loginInputId.focus();
                $loginInputId.focusin();
            } else if (!$scope.form.pw) {
                var $loginInputPw = $('#login-input-pw');
                $loginInputPw.focus();
                $loginInputPw.focusin();
            }
        }
    }

    function inputFocus (key) {
        $scope.focus[key] = true;
    }

    function inputBlur (key) {
        $scope.focus[key] = false;
    }

    function findPass () {
        appNavigator.goToFindPass();
    }

    function signUp () {
        appNavigator.goToSignUp();
    }

    function background () {
        if (vm.backgroundInstance.login) $interval.cancel(vm.backgroundInstance.login);
        if ($scope.backgrounds.length) {
            $scope.style[0] = {
                "background-image": "url(" + $filter('imageUrl')($scope.backgrounds[backgroundIndex])
            };
        }
        vm.backgroundInstance.login = $interval(function () {
            if ($scope.backgrounds.length > 1) {

                if (backgroundIndex < $scope.backgrounds.length - 1) {
                    backgroundIndex++;
                } else {
                    backgroundIndex = 0;
                }

                if ($scope.active[0]) {
                    $scope.style[1] = {
                        "background-image": "url(" + $filter('imageUrl')($scope.backgrounds[backgroundIndex])
                    };
                    $scope.active[0] = false;
                    $scope.active[1] = true;
                } else {
                    $scope.style[0] = {
                        "background-image": "url(" + $filter('imageUrl')($scope.backgrounds[backgroundIndex])
                    };
                    $scope.active[0] = true;
                    $scope.active[1] = false;
                }

            }
        }, 5000);
    }
}