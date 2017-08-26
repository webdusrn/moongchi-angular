export default function PooManageCtrl ($scope, dialogHandler, poosManager, navigator) {
    "ngInject";

    var vm = $scope.vm;

    vm.currentPage('pooManage');

    $scope.findPets = findPets;
    $scope.openModal = openModal;
    $scope.closeModal = closeModal;

    $scope.ready = false;
    $scope.more = false;
    $scope.petPoos = {
        count: 0,
        rows: []
    };
    $scope.modal = {
        add: false,
        detail: false
    };

    $scope.$on('poo-detail-reload', function (event, args) {
        applyPoo(args.poo);
    });

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
                if (refresh) {
                    dialogHandler.show('', '고양이를 등록해주세요.', '', true, null, function () {
                        navigator.goToPetManage();
                    });
                }
            } else {
                dialogHandler.alertError(status, data);
            }
            $scope.ready = true;
        });
    }

    function applyPoo (poo) {
        for (var i=0; i<$scope.petPoos.rows.length; i++) {
            if ($scope.petPoos.rows[i].id == poo.petId) {
                var poos = $scope.petPoos.rows[i].poos;
                if (poos.length) {
                    if (poos[0].pooDate < poo.pooDate) {
                        poos.unshift(poo);
                        if (poos.length > 3) {
                            poos.splice(3, 1);
                        }
                        break;
                    } else if (poos[poos.length - 1].pooDate > poo.pooDate) {
                        poos.push(poo);
                        if (poos.length > 3) {
                            poos.splice(3, 1);
                        }
                        break;
                    } else {
                        for (var j=0; j<poos.length; j++) {
                            if (poos[j].pooDate == poo.pooDate) {
                                poos[j] = poo;
                                break;
                            } else if (poos[j].pooDate < poo.pooDate) {
                                poos.splice(j, 0, poo);
                                if (poos.length > 3) {
                                    poos.splice(3, 1);
                                }
                                break;
                            }
                        }
                    }
                } else {
                    poos.push(poo);
                }
                break;
            }
        }
    }

    function openModal (key, index) {
        if (index !== undefined) {
            $scope.modal[key] = {
                petPoo: $scope.petPoos.rows[index],
                index: index
            };
        } else {
            $scope.modal[key] = true;
        }
    }

    function closeModal (key) {
        $scope.modal[key] = false;
    }
}