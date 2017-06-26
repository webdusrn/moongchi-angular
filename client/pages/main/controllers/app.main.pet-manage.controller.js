export default function PetManageCtrl ($scope, petsManager, dialogHandler) {
    'ngInject';
    var vm = $scope.vm;

    vm.currentPage('pet-manage');

    $scope.openModal = openModal;

    $scope.more = false;
    $scope.pets = {
        count: 0,
        rows: []
    };
    $scope.modal = {
        add: false,
        detail: false
    };

    if (vm.isLoggedIn()) {
        findPets(true);
    }

    function findPets (refresh) {
        var last = null;
        if (refresh) {
            $scope.pets = {
                count: 0,
                rows: []
            };
        } else {
            var rows = $scope.pets.rows;
            last = rows[rows.length - 1].createdAt
        }
        var query = {
            size: vm.defaultLoadingLength
        };
        if (last) query.last = last;
        petsManager.findPets(query, function (status, data) {
            if (status == 200) {
                if (refresh) {
                    $scope.pets = data;
                } else {
                    $scope.pets.rows = $scope.pets.rows.concat(data.rows);
                }
                $scope.more = ($scope.pets.rows.length < $scope.pets.count);
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }
    
    function openModal (key) {
        $scope.modal[key] = true;
    }
}