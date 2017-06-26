export default function AddPetCtrl ($scope, $timeout, metaManager) {
    'ngInject';
    var vm = $scope.vm;
    var now = new Date();
    var nowYear = now.getFullYear();
    var prevYear = null;
    var prevMonth = null;

    $scope.inputPetName = inputPetName;
    $scope.selectPetGender = selectPetGender;
    $scope.inputFocus = inputFocus;
    $scope.inputBlur = inputBlur;
    $scope.goToInputPetSeries = goToInputPetSeries;
    $scope.goToInputPetGender = goToInputPetGender;
    $scope.goToInputPetBirthDate = goToInputPetBirthDate;
    $scope.goToInputPetTreatments = goToInputPetTreatments;
    $scope.goToBack = goToBack;

    $scope.form = {};
    $scope.focus = {
        petName: false,
        petSeries: false,
        petBirthDateYear: false,
        petBirthDateMonth: false,
        petBirthDateDay: false
    };
    $scope.canNext = {
        petSeries: false,
        petGender: false,
        petBirthDate: false,
        petTreatments: false
    };

    $scope.enumPetSeries = metaManager.std.pet.enumCatSeries;
    $scope.enumPetGenders = metaManager.std.pet.enumPetGenders;

    $scope.enumPetBirthDateYears = [];
    for (var i=0; i<20; i++) {
        $scope.enumPetBirthDateYears.push(nowYear - i);
    }

    $scope.enumPetBirthDateMonths = [];
    for (var i=1; i<=12; i++) {
        $scope.enumPetBirthDateMonths.push(i);
    }

    $scope.enumPetBirthDateDays = [];

    $scope.$watch('form.petSeries', function (newVal, oldVal) {
        if ($scope.form.petSeries) {
            $scope.focus.petSeries = true;
            $scope.canNext.petGender = true;
        }
    }, true);

    $scope.$watch('form', function (newVal, oldVal) {
        if ($scope.form.petBirthDateYear && $scope.form.petBirthDateMonth) {
            $scope.focus.petBirthDateYear = !!$scope.form.petBirthDateYear;
            $scope.focus.petBirthDateMonth = !!$scope.form.petBirthDateMonth;
            generateEnumDates();
            $scope.focus.petBirthDateDay = !!$scope.form.petBirthDateDay;
            if ($scope.form.petBirthDateDay) {
                $scope.canNext.petTreatments = true;
            }
        }
    }, true);

    function generateEnumDates () {
        if (prevYear != $scope.form.petBirthDateYear || prevMonth != $scope.form.petBirthDateMonth) {
            $scope.enumPetBirthDateDays = [];
            prevYear = $scope.form.petBirthDateYear;
            prevMonth = $scope.form.petBirthDateMonth;
            var date = 32 - new Date(prevYear, prevMonth - 1, 32).getDate();
            for (var i=1; i<=date; i++) {
                $scope.enumPetBirthDateDays.push(i);
            }
            $scope.form.petBirthDateDay = '';
        }
    }

    function inputPetName () {
        if ($scope.form.petName) {
            $scope.canNext.petSeries = true;
            var $addPetNameButton = $('#add-pet-name-button');
            $addPetNameButton.blur();
            $addPetNameButton.focusout();
        } else {
            var $inputAddPetName = $('#add-pet-name');
            $inputAddPetName.focus();
            $inputAddPetName.focusin();
        }
    }

    function selectPetGender (index) {
        $scope.form.petGender = $scope.enumPetGenders[index];
        $scope.canNext.petBirthDate = true;
    }

    function inputFocus (key) {
        $scope.focus[key] = true;
    }

    function inputBlur (key) {
        if (!$scope.form[key]) $scope.focus[key] = false;
    }

    function goToBottom (index) {
        var $window = $('#add-pet-window');
        $window.animate({scrollTop: $window.height() * index}, 300);
    }

    function goToInputPetSeries () {
        goToBottom(1);
        $scope.goToInputPetSeries = null;
    }

    function goToInputPetGender () {
        goToBottom(2);
        $scope.goToInputPetGender = null;
    }

    function goToInputPetBirthDate () {
        goToBottom(3);
        $scope.goToInputPetBirthDate = null;
    }

    function goToInputPetTreatments () {
        goToBottom(4);
        $scope.goToInputPetTreatments = null;
    }

    function goToBack () {
        var $window = $('#add-pet-window');
        var windowHeight = $window.height();
        var scrollTop = $window.scrollTop();
        if (scrollTop <= windowHeight) {
            $window.animate({scrollTop: 0}, 300);
        } else if (scrollTop <= windowHeight * 2) {
            $window.animate({scrollTop: windowHeight}, 300);
        } else if (scrollTop <= windowHeight * 3) {
            $window.animate({scrollTop: windowHeight * 2}, 300);
        } else if (scrollTop <= windowHeight * 4) {
            $window.animate({scrollTop: windowHeight * 3}, 300);
        }
    }
}