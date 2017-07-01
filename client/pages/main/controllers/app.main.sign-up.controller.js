export default function SignUpCtrl ($scope, $rootScope, navigator, sessionManager, dialogHandler) {
    'ngInject';
    var vm = $scope.vm;
    var passExp = new RegExp("^.*(?=.{" + 6 + "," + 12 +"})(?=.*[0-9])(?=.*[a-zA-Z]).*$");
    var emailExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    vm.currentPage("signUp");

    $scope.signUp = signUp;
    $scope.inputFocus = inputFocus;
    $scope.inputBlur = inputBlur;
    $scope.login = login;

    $scope.form = {
        id: '',
        pw: ''
    };
    $scope.focus = {
        id: false,
        pw: false
    };

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
}