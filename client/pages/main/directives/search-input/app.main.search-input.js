export default function searchInput (metaManager) {
    'ngInject';

    var templatePath = metaManager.std.templatePath;

    return {
        restrict: 'AE',
        scope: {
            ngPlaceholder: '@',
            ngModel: '=',
            ngFunc: '='
        },
        templateUrl: templatePath + 'main/directives/search-input/app.main.search-input.html'
    }
}