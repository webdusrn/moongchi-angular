export default function selectPooColor (metaManager) {
    'ngInject';

    var templatePath = metaManager.std.templatePath;
    var enumPooColors = metaManager.std.poo.enumPooColors.slice();

    return {
        restrict: 'AE',
        scope: {
            ngModel: '='
        },
        templateUrl: templatePath + 'main/directives/select-poo-color/app.main.select-poo-color.html',
        link: function (scope, element, attr) {
            var enumPooColors1 = enumPooColors.splice(0, 6);
            var enumPooColors2 = enumPooColors.splice(6, 12);
            var enumPooColors3 = enumPooColors.splice(12, 18);
            var enumPooColors4 = enumPooColors.splice(18, 19);

            scope.ngView = false;
        }
    }
}