export default function DetailPetCtrl ($scope, $rootScope, $filter, metaManager, dialogHandler, loadingHandler, petsManager, uploadManager, modalHandler) {
    'ngInject';

    var vm = $scope.vm;
    var PET = metaManager.std.pet;
    var FILE = metaManager.std.file;
    var attachZero = $filter('attachZero');
    var neuter = $filter('neuter');
    var vaccination = $filter('vaccination');
    var $target = $('#detail-pet-wrap');

    var NEUTER_TRUE = '했음';
    var NEUTER_FALSE = '안함';
    var VACCINATION1 = 1;
    var VACCINATION2 = 2;
    var VACCINATION3 = 3;
    var VACCINATION_FALSE = 0;

    var enumMonths = [];
    for (var i=1; i<=12; i++) {
        enumMonths.push(attachZero(i));
    }
    var enumDates = {
        28: [],
        29: [],
        30: [],
        31: []
    };
    for (var i=1; i<=31; i++) {
        if (i <= 28) enumDates['28'].push(attachZero(i));
        if (i <= 29) enumDates['29'].push(attachZero(i));
        if (i <= 30) enumDates['30'].push(attachZero(i));
        if (i <= 31) enumDates['31'].push(attachZero(i));
    }

    $scope.close = close;
    $scope.createPet = createPet;
    $scope.updatePet = updatePet;
    $scope.deletePet = deletePet;
    $scope.clearBirth = clearBirth;
    $scope.selectVaccination = selectVaccination;

    $scope.enumPetGenders = PET.enumPetGenders.slice();
    $scope.enumPetSeries = PET.enumCatSeries.slice();
    $scope.enumNeuters = [NEUTER_TRUE, NEUTER_FALSE];
    $scope.enumVaccinations = [VACCINATION1, VACCINATION2, VACCINATION3, VACCINATION_FALSE];
    $scope.enumMonths = enumMonths;
    $scope.enumDates = [];

    $scope.isCreate = null;
    $scope.isOpen = false;
    $scope.form = {};

    $scope.uploader = new vm.FileUploader({
        onAfterAddingAll: function (items) {
            var file = items[0]._file;
            uploadManager.uploadImages([file], FILE.folderPet, function (status, data) {
                if (status == 201) {
                    $scope.form.imageId = data.images[0].id;
                    $scope.form.image = data.images[0];
                } else {
                    dialogHandler.alertError(status, data);
                }
            });
            $scope.uploader.clearQueue();
        }
    });

    $scope.$watch('form.birthYear', function (n, o) {
        if (n != o) {
            generateEnumDates();
        }
    }, true);

    $scope.$watch('form.birthMonth', function (n, o) {
        if (n != o) {
            generateEnumDates();
        }
    }, true);

    $scope.$on('open-detail-pet', function (event, args) {
        if (args.pet) {
            $scope.form = generateForm(args.pet);
            $scope.isOpen = true;
            $scope.isCreate = false;
            modalHandler.focus($target);
        }
    });

    $scope.$on('open-create-pet', function (event, args) {
        $scope.isOpen = true;
        $scope.isCreate = true;
        $scope.form = {
            id: parseInt(Math.random() * 5) + 1,
            vaccination: 0
        };
        modalHandler.focus($target);
    });

    function generateForm (data) {
        var form = angular.copy(data);
        if (form.birthAt) {
            var birthAt = new Date(form.birthAt);
            form.birthYear = birthAt.getFullYear();
            form.birthMonth = attachZero(birthAt.getMonth() + 1);
            form.birthDate = attachZero(birthAt.getDate());
        }
        form.vaccination = vaccination(form, VACCINATION1, VACCINATION2, VACCINATION3, VACCINATION_FALSE);
        form.neuter = neuter(form, NEUTER_TRUE, NEUTER_FALSE);
        return form;
    }

    function generateEnumDates () {
        if ($scope.form.birthYear && $scope.form.birthMonth) {
            var maxDate = new Date($scope.form.birthYear, parseInt($scope.form.birthMonth), 0).getDate();
            $scope.enumDates = enumDates[maxDate];
        }
    }

    function selectVaccination (vaccination) {
        if ($scope.form.vaccination >= vaccination) {
            $scope.form.vaccination = vaccination - 1;
        } else {
            $scope.form.vaccination = vaccination;
        }
    }
    
    function createPet () {
        var body = generateBody($scope.form);
        petsManager.createPet(body, function (status, data) {
            if (status == 201) {
                $rootScope.$broadcast('create-pet', {
                    pet: data
                });
                close();
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }
    
    function updatePet () {
        var body = generateBody($scope.form);
        petsManager.updatePet(body, function (status, data) {
            if (status == 204) {
                $rootScope.$broadcast('update-pet', {});
                close();
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function deletePet () {
        petsManager.deletePet($scope.form, function (status, data) {
            if (status == 204) {
                $rootScope.$broadcast('delete-pet', {});
                close();
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function generateBody (data) {
        var body = angular.copy(data);
        body.isVaccination1 = false;
        body.isVaccination2 = false;
        body.isVaccination3 = false;
        for (var i=0; i<body.vaccination; i++) {
            body['isVaccination' + (i + 1)] = true;
        }
        body.isNeuter = body.neuter == NEUTER_TRUE;
        if (body.birthYear && body.birthMonth && body.birthDate) {
            body.birthAt = body.birthYear + '-' + body.birthMonth + '-' + body.birthDate;
        }
        return body;
    }

    function clearBirth () {
        delete $scope.form.birthYear;
        delete $scope.form.birthMonth;
        delete $scope.form.birthDate;
    }

    modalHandler.eventBind($target, function () {
        vm.apply(function () {
            close();
        });
    });

    function close () {
        $scope.isOpen = false;
        $scope.isCreate = null;
        $scope.form = {};
    }
}