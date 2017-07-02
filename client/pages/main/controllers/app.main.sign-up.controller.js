export default function SignUpCtrl ($scope, $rootScope, $filter, $interval, navigator, sessionManager, dialogHandler) {
    'ngInject';
    var vm = $scope.vm;
    var backgroundIndex = 0;
    var passExp = new RegExp("^.*(?=.{" + 6 + "," + 12 +"})(?=.*[0-9])(?=.*[a-zA-Z]).*$");
    var emailExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    vm.currentPage("signUp");

    $scope.signUp = signUp;
    $scope.inputFocus = inputFocus;
    $scope.inputBlur = inputBlur;
    $scope.login = login;

    $scope.active = [true, false];
    $scope.style = [{}, {}];
    $scope.backgrounds = [];

    $scope.form = {
        id: '',
        pw: ''
    };
    $scope.focus = {
        id: false,
        pw: false
    };

    if (vm.backgroundReady) {
        $scope.backgrounds = vm.backgrounds.all.concat(vm.backgrounds.signUp);
        background();
    } else {
        $scope.$watch('vm.backgroundReady', function (newVal, oldVal) {
            if (newVal != oldVal) {
                $scope.backgrounds = vm.backgrounds.all.concat(vm.backgrounds.signUp);
                background();
            }
        }, true);
    }

    function signUp () {
        if ($scope.form.id && $scope.form.pw) {

            if (!emailExp.test($scope.form.id)) {
                focusId();
                return dialogHandler.show(false, vm.translate("wrongSignUpId"), false, true);
            }

            if (!passExp.test($scope.form.pw)) {
                focusPw();
                return dialogHandler.show(false, vm.translate("wrongSignUpPw"), false, true);
            }

            sessionManager.signup({
                type: vm.USER.signUpTypeEmail,
                uid: $scope.form.id,
                secret: $scope.form.pw
            }, function (status, data) {
                if (status == 201) {
                    $rootScope.$broadcast("core.session.callback", {
                        type: "signup"
                    });
                } else {
                    dialogHandler.alertError(status, data);
                }
            });
        } else {
            if (!$scope.form.id) {
                focusId();
            } else if (!$scope.form.pw) {
                focusPw();
            }
        }
    }

    function focusId () {
        focusKey('#sign-up-input-id');
    }

    function focusPw () {
        focusKey('#sign-up-input-pw');
    }

    function focusKey (key) {
        var $key = $(key);
        $key.focus();
        $key.focusin();
    }

    function inputFocus (key) {
        $scope.focus[key] = true;
    }

    function inputBlur (key) {
        $scope.focus[key] = false;
    }

    function login () {
        navigator.goToLogin();
    }

    function background () {
        if (vm.backgroundInstance.signUp) $interval.cancel(vm.backgroundInstance.signUp);
        if ($scope.backgrounds.length) {
            $scope.style[0] = {
                "background-image": "url(" + $filter('imageUrl')($scope.backgrounds[backgroundIndex])
            };
        }
        vm.backgroundInstance.signUp = $interval(function () {
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