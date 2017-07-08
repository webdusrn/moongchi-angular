export default function PooManageCtrl ($scope, dialogHandler, poosManager) {
    "ngInject";

    var vm = $scope.vm;

    vm.currentPage('pooManage');

    $scope.findPets = findPets;
    $scope.goToPetManage = goToPetManage;

    $scope.ready = false;
    $scope.more = false;
    $scope.petPoos = {
        count: 0,
        rows: []
    };
    $scope.modal = {

    };

    if (vm.isLoggedIn()) {
        findPets(true);
    }

    function findPets (refresh) {
        var last = null;
        if (refresh) {
            $scope.petPoos = {
                count: 0,
                rows: []
            };
        } else {
            var rows = $scope.petPoos.rows;
            last = rows[rows.length - 1].createdAt;
        }
        var query = {
            size: vm.defaultLoadingLength
        };
        if (last) query.last = last;
        poosManager.findPets(query, function (status, data) {
            if (status == 200) {
                if (refresh) {
                    $scope.petPoos = data;
                } else {
                    $scope.petPoos.rows = $scope.petPoos.rows.concat(data.rows);
                }
                $scope.more = ($scope.petPoos.rows.length < $scope.petPoos.count);
            } else if (status == 404) {
                $scope.more = false;
            } else {
                dialogHandler.alertError(status, data);
            }
            $scope.ready = true;
        });
    }

    function goToPetManage () {

    }
}