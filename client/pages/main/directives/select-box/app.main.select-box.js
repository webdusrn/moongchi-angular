export default function selectBox (metaManager) {
    'ngInject';

    var templatePath = metaManager.std.templatePath;
    
    return {
        restrict: 'AE',
        scope: {
            ngClass: '@',
            ngTitle: '@',
            ngEnum: '=',
            ngModel: '='
        },
        templateUrl: templatePath + 'main/directives/select-box/app.main.select-box.html'
    }
}