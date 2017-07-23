export default function AddPetCtrl ($scope, $element, $timeout, $filter, metaManager, petsManager, dialogHandler) {
    'ngInject';
    var vm = $scope.vm;
    var attachZero = $filter('attachZero');
    var now = new Date();
    var nowTime = new Date(now.getFullYear() + '-' + attachZero(now.getMonth() + 1) + '-' + now.getDate()).getTime();
    var nowYear = now.getFullYear();
    var prevYear = null;
    var prevMonth = null;
    var init = null;

    $scope.inputPetName = inputPetName;
    $scope.selectPetGender = selectPetGender;
    $scope.addVaccination = addVaccination;
    $scope.noVaccination = noVaccination;
    $scope.canAddVaccination = canAddVaccination;
    $scope.inputFocus = inputFocus;
    $scope.inputBlur = inputBlur;
    $scope.goToInputPetSeries = goToInputPetSeries;
    $scope.goToInputPetGender = goToInputPetGender;
    $scope.goToInputPetBirthDate = goToInputPetBirthDate;
    $scope.goToInputPetTreatments = goToInputPetTreatments;
    $scope.goToBack = goToBack;
    $scope.goToNext = goToNext;
    $scope.next = next;
    $scope.addPet = addPet;

    $scope.form = {
        vaccinations: {
            "1": false,
            "2": false,
            "3": false
        }
    };
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

    $scope.enumPetSeries = vm.PET.enumCatSeries.slice();
    $scope.enumPetGenders = vm.PET.enumPetGenders.slice();

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

    $scope.$watch('form.petBirthDateYear', function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.focus.petBirthDateYear = true;
            focusObject($('#add-pet-birth-date-month'));
        }
    }, true);

    $scope.$watch('form.petBirthDateMonth', function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.focus.petBirthDateMonth = true;
            focusObject($('#add-pet-birth-date-day'));
        }
    }, true);

    $scope.$watch('form', function () {
        if ($scope.form.petBirthDateYear && $scope.form.petBirthDateMonth) {
            generateEnumDates();
            $scope.focus.petBirthDateDay = !!$scope.form.petBirthDateDay;
            if ($scope.form.petBirthDateDay) {
                $scope.canNext.petTreatments = true;
                var birthDate = $scope.form.petBirthDateYear + '-' + attachZero($scope.form.petBirthDateMonth) + '-' + attachZero($scope.form.petBirthDateDay);
                $scope.petBirthDate = new Date(birthDate).getTime();
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
            $scope.petBirthDate = null;
        }
    }

    function inputPetName () {
        if (!init) {
            init = true;
            backButtonEvent();
        }
        if ($scope.form.petName) {
            $scope.canNext.petSeries = true;
            blurObject($('#add-pet-name-button'));
        } else {
            focusObject($('#add-pet-name'));
        }
    }

    function backButtonEvent () {
        var $window = $('#add-pet-window');
        var windowHeight = $window.height();
        var $backButton = $('#add-pet-back-button');
        $window.scroll(function () {
            if ($window.scrollTop() > windowHeight * 4 - 60) {
                if (!$backButton.hasClass('translate')) {
                    $backButton.addClass('translate');
                }
            } else {
                if ($backButton.hasClass('translate')) {
                    $backButton.removeClass('translate');
                }
            }
        });
    }

    function selectPetGender (index) {
        $scope.form.petGender = $scope.enumPetGenders[index];
        $scope.canNext.petBirthDate = true;
    }

    function addVaccination (key) {
        $scope.form.vaccinations = {
            "1": false,
            "2": false,
            "3": false
        };
        $scope.form.vaccinations[key] = true;
    }

    function noVaccination () {
        if ($scope.form.vaccinations['1'] || $scope.form.vaccinations['2'] || $scope.form.vaccinations['3']) {
            $scope.form.vaccinations = {
                "1": false,
                "2": false,
                "3": false
            };
        }
    }

    function canAddVaccination (key) {
        return (nowTime - $scope.petBirthDate) > 3628800000 + (1814400000 * key);
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
        $timeout(function () {
            focusObject($('#add-pet-series-select'));
        }, 300);
        $scope.goToInputPetSeries = null;
    }

    function goToInputPetGender () {
        blurObject($('#add-pet-series-select'));
        goToBottom(2);
        $timeout(function () {
            focusObject($('#add-pet-gender-m-button'));
        }, 300);
        $scope.goToInputPetGender = null;
    }

    function goToInputPetBirthDate () {
        blurObject($('#add-pet-gender-m-button'));
        goToBottom(3);
        $timeout(function () {
            focusObject($('#add-pet-birth-date-year'));
        }, 300);
        $scope.goToInputPetBirthDate = null;
    }

    function goToInputPetTreatments () {
        blurObject($('#add-pet-birth-date-year'));
        blurObject($('#add-pet-birth-date-month'));
        blurObject($('#add-pet-birth-date-day'));
        goToBottom(4);
        $scope.goToInputPetTreatments = null;
    }

    function goToNext () {
        var $window = $('#add-pet-window');
        var windowHeight = $window.height();
        var scrollTop = $window.scrollTop();

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

    function next(index) {
        var $window = $('#add-pet-window');
        var windowHeight = $window.height();
        if (index == 1) {
            if ($scope.canNext.petSeries) {
                $window.animate({scrollTop: windowHeight * index}, 300);
            }
        }
    }

    function addPet () {
        var $window = $('#add-pet-window');
        var body = angular.copy($scope.form);

        if (!body.petName) {
            $window.animate({scrollTop: 0}, 300);
            return $timeout(function () {
                focusObject($('#add-pet-name'));
            }, 300);
        }

        if ($scope.petBirthDate) {
            body.petBirthDate = new Date($scope.petBirthDate);
        } else {

            var windowHeight = $window.height();
            $window.animate({scrollTop: windowHeight * 3}, 300);
            return $timeout(function () {
                focusObject($('#add-pet-birth-date-day'));
            }, 300);
        }

        if (body.vaccinations['1'] ||
            body.vaccinations['2'] ||
            body.vaccinations['3']) {
            body.treatmentArray = [];
            if (body.vaccinations['1']) {
                body.treatmentArray.push({
                    treatmentType: vm.TREATMENT.treatmentTypeVaccination,
                    treatmentTitle: vm.TREATMENT.vaccination1
                });
            }
            if (body.vaccinations['2']) {
                body.treatmentArray.push({
                    treatmentType: vm.TREATMENT.treatmentTypeVaccination,
                    treatmentTitle: vm.TREATMENT.vaccination1
                });
                body.treatmentArray.push({
                    treatmentType: vm.TREATMENT.treatmentTypeVaccination,
                    treatmentTitle: vm.TREATMENT.vaccination2
                });
            }
            if (body.vaccinations['3']) {
                body.treatmentArray.push({
                    treatmentType: vm.TREATMENT.treatmentTypeVaccination,
                    treatmentTitle: vm.TREATMENT.vaccination1
                });
                body.treatmentArray.push({
                    treatmentType: vm.TREATMENT.treatmentTypeVaccination,
                    treatmentTitle: vm.TREATMENT.vaccination2
                });
                body.treatmentArray.push({
                    treatmentType: vm.TREATMENT.treatmentTypeVaccination,
                    treatmentTitle: vm.TREATMENT.vaccination3
                });
            }
        } else {
            body.treatmentArray = [{
                treatmentType: vm.TREATMENT.treatmentTypeNoVaccination,
                treatmentTitle: vm.TREATMENT.noVaccination
            }];
        }

        body.treatmentArray = JSON.stringify(body.treatmentArray);

        petsManager.createPet(body, function (status, data) {
            if (status == 201) {
                $scope.addPetSuccess(data);
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function blurObject ($object) {
        $object.blur();
        $object.focusout();
    }

    function focusObject ($object) {
        $object.focus();
        $object.focusin();
    }

    $element.bind('keydown', function (e) {
        var keyCode = (e.keyCode ? e.keyCode : e.which);

        switch (keyCode) {
            case 27:
                if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
                    $scope.modal.add = false;
                } else {
                    $scope.$apply(function () {
                        $scope.modal.add = false;
                    });
                }
                break;
        }
    });
}