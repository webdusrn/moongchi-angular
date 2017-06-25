export default function LoginCtrl ($scope, $rootScope, $cookies, sessionManager, dialogHandler, navigator) {
    "ngInject";
    var vm = $scope.vm;

    vm.currentPage("login");

    $scope.login = login;
    $scope.inputFocus = inputFocus;
    $scope.inputBlur = inputBlur;
    $scope.findPass = findPass;
    $scope.signUp = signUp;

    $scope.storeText = vm.translate('storeId');

    $scope.form = {
        store: false,
        id: '',
        pw: ''
    };
    $scope.focus = {
        id: false,
        pw: false
    };

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
        navigator.goToFindPass();
    }

    function signUp () {
        navigator.goToSignUp();
    }
}