export default function PetManageCtrl ($scope, petsManager, dialogHandler) {
    'ngInject';
    var vm = $scope.vm;

    vm.currentPage('petManage');

    $scope.findPets = findPets;
    $scope.openModal = openModal;
    $scope.closeModal = closeModal;
    $scope.addPetSuccess = addPetSuccess;
    $scope.updatePetSuccess = updatePetSuccess;
    $scope.deletePetSuccess = deletePetSuccess;

    $scope.ready = false;
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
            last = rows[rows.length - 1].createdAt;
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
            $scope.ready = true;
        });
    }
    
    function openModal (key, index) {
        if (index !== undefined) {
            $scope.modal[key] = {
                pet: $scope.pets.rows[index],
                index: index
            };
        } else {
            $scope.modal[key] = true;
        }
    }

    function closeModal (key) {
        $scope.modal[key] = false;
    }

    function addPetSuccess (pet) {
        $scope.pets.count++;
        $scope.pets.rows.unshift(pet);
        closeModal('add');
    }

    function updatePetSuccess (pet, index) {
        $scope.pets.rows[index] = pet;
        closeModal('detail');
    }

    function deletePetSuccess (index) {
        $scope.pets.count--;
        $scope.pets.rows.splice(index, 1);
        closeModal('detail');
    }
}