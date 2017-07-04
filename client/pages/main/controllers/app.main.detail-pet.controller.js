export default function DetailPetCtrl ($scope, petsManager, dialogHandler) {
    "ngInject";

    var vm = $scope.vm;
    var imageExp = new RegExp('image', 'i');
    var now = new Date();
    var nowTime = new Date(now.getFullYear() + '-' + attachZero(now.getMonth() + 1) + '-' + now.getDate()).getTime();
    var nowYear = now.getFullYear();
    var prevYear = null;
    var prevMonth = null;

    $scope.inputFocus = inputFocus;
    $scope.inputBlur = inputBlur;
    $scope.updatePet = updatePet;
    $scope.clearImage = clearImage;

    $scope.focus = {};
    $scope.form = {};
    $scope.ready = false;
    $scope.pet = angular.copy($scope.modal.detail.pet);
    $scope.enumPetSeries = vm.PET.enumCatSeries.slice();
    $scope.enumPetGenders = vm.PET.enumPetGenders.slice();
    $scope.imageUploader = new vm.FileUploader({
        queueLimit: 1
    });

    $scope.imageUploader.onAfterAddingAll = function (items) {
        var files = [];
        for (var i=0; i<items.length; i++) {
            if (imageExp.test(items[i]._file.type)) {
                files.push(items[i]._file);
            } else {
                $scope.imageUploader.clearQueue();
                return dialogHandler.show(false, vm.translate("wrongImageFile"), false, true);
            }
        }
        if (files.length > 0) {
            petsManager.uploadImages(files, vm.FILE.folderPet, progressCallback, successCallback);
        }
    };

    $scope.enumPetBirthDateYears = [];
    for (var i=0; i<20; i++) {
        $scope.enumPetBirthDateYears.push(nowYear - i);
    }
    $scope.enumPetBirthDateMonths = [];
    for (var i=1; i<=12; i++) {
        $scope.enumPetBirthDateMonths.push(i);
    }
    $scope.enumPetBirthDateDays = [];

    if ($scope.pet) {
        petsManager.findPetById($scope.pet.id, function (status, data) {
            if (status == 200) {
                $scope.form = angular.copy(data);
                $scope.form.petBirthDateYear = generateYear(data);
                $scope.form.petBirthDateMonth = generateMonth(data);
                generateEnumDates();
                $scope.form.petBirthDateDay = generateDay(data);
                $scope.pet = data;
                $scope.ready = true;
                init();
            } else {
                $scope.modal.detail = false;
            }
        });
    }

    function init () {
        $scope.$watch('form.petBirthDateYear', function (newVal, oldVal) {
            if (newVal != oldVal) {
                generateEnumDates(true);
            }
        }, true);

        $scope.$watch('form.petBirthDateMonth', function (newVal, oldVal) {
            if (newVal != oldVal) {
                generateEnumDates(true);
            }
        }, true);

        $scope.$watch('form.petBirthDateDay', function (newVal, oldVal) {
            if (newVal != oldVal) {
                if ($scope.form.petBirthDateDay) {
                    var birthDate = $scope.form.petBirthDateYear + '-' + attachZero($scope.form.petBirthDateMonth) + '-' + $scope.form.petBirthDateDay;
                    $scope.form.petBirthDate = new Date(birthDate).getTime();
                } else {
                    $scope.form.petBirthDate = null;
                }
            }
        }, true);
    }

    function attachZero (value) {
        if (value && value < 10 && value > 0) {
            return '0' + value;
        } else {
            return value;
        }
    }

    function generateEnumDates (refresh) {
        $scope.enumPetBirthDateDays = [];
        prevYear = $scope.form.petBirthDateYear;
        prevMonth = $scope.form.petBirthDateMonth;
        var date = 32 - new Date(prevYear, prevMonth - 1, 32).getDate();
        for (var i=1; i<=date; i++) {
            $scope.enumPetBirthDateDays.push(i);
        }
        if (refresh) {
            $scope.form.petBirthDateDay = '';
        }
    }

    function generateYear (data) {
        return new Date(data.petBirthDate).getFullYear().toString();
    }

    function generateMonth (data) {
        return (new Date(data.petBirthDate).getMonth() + 1).toString();
    }

    function generateDay (data) {
        return new Date(data.petBirthDate).getDate().toString();
    }

    function updatePet () {
        if (!$scope.form.petName) {
            focus($('#detail-pet-name'));
            return dialogHandler.show(false, vm.translate("wrongPetName"), false, true);
        }
        if ($scope.form.petBirthDate) {
            $scope.form.petBirthDate = new Date($scope.form.petBirthDate);
        } else {
            focus($('#detail-pet-birth-date-day'));
            return dialogHandler.show(false, vm.translate("wrongPetBirthDate"), false, true);
        }
        petsManager.updatePetById($scope.form, function (status, data) {
            if (status == 204) {
                for (var k in $scope.pet) {
                    $scope.pet[k] = $scope.form[k];
                }
                $scope.updatePetSuccess($scope.pet, $scope.modal.detail.index);
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function progressCallback (progressing) {
        console.log("progressing", progressing);
    }

    function successCallback (status, data) {
        if (status == 201) {
            console.log(data);
            $scope.form.imageId = data.images[0].id;
            $scope.form.image = data.images[0];
        } else {
            dialogHandler.alertError(status, data);
        }
    }

    function clearImage () {
        $scope.form.imageId = null;
    }

    function inputFocus (key) {
        $scope.focus[key] = true;
    }

    function inputBlur (key) {
        if (!$scope.form[key]) $scope.focus[key] = false;
    }

    function focus ($object) {
        $object.focus();
        $object.focusin();
    }
}