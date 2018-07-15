export default function contentTitle (metaManager) {
    'ngInject';

    var templatePath = metaManager.std.templatePath;

    return {
        restrict: 'AE',
        scope: {
            ngTitle: '@',
            ngCreateTitle: '@',
            ngCreateFunc: '='
        },
        templateUrl: templatePath + 'main/directives/content-title/app.main.content-title.html',
        link: function (scope, element, attr) {

        }
    }
}