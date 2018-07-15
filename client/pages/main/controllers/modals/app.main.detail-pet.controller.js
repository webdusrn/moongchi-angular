export default function DetailPetCtrl ($scope, $filter, metaManager, dialogHandler, loadingHandler, petsManager, modalHandler) {
    'ngInject';

    var vm = $scope.vm;
    var PET = metaManager.std.pet;
    var TREATMENT = metaManager.std.treatment;
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
    $scope.selectVaccination = selectVaccination;

    $scope.enumPetGenders = PET.enumPetGenders.slice();
    $scope.enumNeuters = [NEUTER_TRUE, NEUTER_FALSE];
    $scope.enumVaccinations = [VACCINATION1, VACCINATION2, VACCINATION3, VACCINATION_FALSE];
    $scope.enumMonths = enumMonths;
    $scope.enumDates = [];

    $scope.isCreate = null;
    $scope.isOpen = false;
    $scope.form = {};

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
            $scope.form = generateForm(angular.copy(args.pet));
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
        if (data.birthAt) {
            var birthAt = new Date(data.birthAt);
            data.birthYear = birthAt.getFullYear();
            data.birthMonth = attachZero(birthAt.getMonth() + 1);
            data.birthDate = attachZero(birthAt.getDate());
        }
        data.vaccination = vaccination(data, VACCINATION1, VACCINATION2, VACCINATION3, VACCINATION_FALSE);
        data.neuter = neuter(data, NEUTER_TRUE, NEUTER_FALSE);
        return data;
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
        
    }
    
    function updatePet () {

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