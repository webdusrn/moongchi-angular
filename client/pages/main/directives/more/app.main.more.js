export default function more (metaManager) {
    'ngInject';

    var templatePath = metaManager.std.templatePath;

    return {
        restrict: 'AE',
        scope: {
            ngMore: '=',
            ngFunc: '='
        },
        templateUrl: templatePath + 'main/directives/more/app.main.more.html'
    }
}