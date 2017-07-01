export default function DetailPetCtrl ($scope, petsManager) {
    "ngInject";

    var vm = $scope.vm;

    $scope.ready = false;
    $scope.pet = angular.copy($scope.modal.detail);

    if ($scope.pet) {
        petsManager.findPetById($scope.pet.id, function (status, data) {
            if (status == 200) {
                $scope.pet = data;
                $scope.ready = true;
            } else {
                $scope.modal.detail = false;
            }
        });
    }
}