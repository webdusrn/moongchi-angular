export default function pooInfo (metaManager) {
    'ngInject';

    var templatePath = metaManager.std.templatePath;

    return {
        restrict: 'AE',
        scope: {
            ngPoo: '='
        },
        templateUrl: templatePath + 'main/directives/poo-info/app.main.poo-info.html',
        link: function (scope, element, attr) {
            scope.pooColor = {
                'background-color': scope.ngPoo.pooColor
            };
        }
    }
}