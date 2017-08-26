export default function DetailPooCtrl ($rootScope, $scope, $element, $filter, dialogHandler, metaManager, poosManager) {
    'ngInject';

    var vm = $scope.vm;
    var now = new Date();
    var attachZero = $filter('attachZero');
    var POO = metaManager.std.poo;

    $scope.createPoo = createPoo;

    $scope.enumPooColors = POO.enumPooColors.slice();
    $scope.enumPooTypes = POO.enumPooTypes.slice();

    $scope.ready = false;
    $scope.petPoo = angular.copy($scope.modal.detail.petPoo);
    $scope.form = {
        pooType: $scope.enumPooTypes[0],
        pooColor: $scope.enumPooColors[0],
        pooDate: now.getFullYear() + '-' + attachZero(now.getMonth() + 1) + '-' + attachZero(now.getDate()),
        year: now.getFullYear().toString(),
        month: attachZero(now.getMonth() + 1) + ''
    };

    if (!$scope.petPoo) {
        $scope.closeModal('detail');
    } else {
        $scope.ready = true;
    }

    function createPoo () {
        var body = angular.copy($scope.form);
        body.pooDate = new Date(new Date(body.pooDate + ' 00:00:00').getTime());
        body.petId = $scope.petPoo.id;
        poosManager.createPoo(body, function (status, data) {
            if (status == 201) {
                if ($scope.form.year == now.getFullYear().toString() && $scope.form.month == attachZero(now.getMonth() + 1) + '') {
                    $rootScope.$broadcast('poo-calendar-reload');
                    $rootScope.$broadcast('poo-detail-reload', {
                        poo: data
                    });
                }
            } else {
                dialogHandler.alertError(status, data);
            }
        });
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