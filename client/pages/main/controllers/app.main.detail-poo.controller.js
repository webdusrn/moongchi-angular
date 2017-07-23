export default function DetailPooCtrl ($scope, $element, $filter, poosManager) {
    'ngInject';

    var vm = $scope.vm;
    var now = new Date();

    $scope.ready = false;
    $scope.petPoo = angular.copy($scope.modal.detail.petPoo);
    $scope.form = {
        year: now.getFullYear().toString(),
        month: $filter('attachZero')(now.getMonth()) + ''
    };

    if ($scope.petPoo) {
        poosManager.findPetById($scope.petPoo.id, function (status, data) {
            if (status == 200) {
                $scope.form = angular.copy(data);
                $scope.ready = true;
            } else {
                $scope.closeModal('detail');
            }
        });
    } else {
        $scope.closeModal('detail');
    }

    function focusObject ($object) {
        $object.focus();
        $object.focusin();
    }

    focusObject($element);
    $element.bind('keydown', function (e) {
        var keyCode = (e.keyCode ? e.keyCode : e.which);

        switch (keyCode) {
            case 27:
                if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
                    $scope.modal.detail = false;
                } else {
                    $scope.$apply(function () {
                        $scope.modal.detail = false;
                    });
                }
                break;
        }
    });
}