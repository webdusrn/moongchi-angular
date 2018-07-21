export default function selectPet ($rootScope, metaManager, dialogHandler, petsManager, modalHandler) {
    'ngInject';

    var templatePath = metaManager.std.templatePath;

    return {
        restrict: 'AE',
        scope: {
            ngClass: '@',
            ngPet: '=',
            ngFilter: '=',
            ngKey: '@'
        },
        templateUrl: templatePath + 'main/directives/select-pet/app.main.select-pet.html',
        link: function (scope, element, attr) {
            scope.openModal = openModal;

            scope.$on(scope.ngKey, function (event, args) {
                if (args.pet !== undefined) {
                    scope.ngPet = args.pet;
                }
            });

            function openModal () {
                $rootScope.$broadcast('select-pet', {
                    eventKey: scope.ngKey,
                    isFilter: scope.ngFilter
                });
            }
        }
    }
}