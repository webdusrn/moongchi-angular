export default function SignUpCtrl ($scope) {
    'ngInject';
    var vm = $scope.vm;

    vm.currentPage("signUp");

    $scope.signUp = signUp;
    $scope.inputFocus = inputFocus;
    $scope.inputBlur = inputBlur;

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

        } else {
            if (!$scope.form.id) {
                var $signUpInputId = $('#sign-up-input-id');
                $signUpInputId.focus();
                $signUpInputId.focusin();
            } else if (!$scope.form.pw) {
                var $signUpInputPw = $('#sign-up-input-pw');
                $signUpInputPw.focus();
                $signUpInputPw.focusin();
            }
        }
    }

    function inputFocus (key) {
        $scope.focus[key] = true;
    }

    function inputBlur (key) {
        $scope.focus[key] = false;
    }
}