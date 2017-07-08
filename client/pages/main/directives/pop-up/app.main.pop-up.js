export default function popUp ($filter, $rootScope, metaManager, popUpsManager, dialogHandler) {
    'ngInject';

    var templatePath = metaManager.std.templatePath;

    return {
        restrict: 'AE',
        scope: {
            ngItem: '='
        },
        templateUrl: templatePath + 'main/directives/pop-up/app.main.pop-up.html',
        link: function (scope, element, attr) {
            scope.style = {
                'background-image': 'url(' + $filter('imageUrl')(scope.ngItem.image) + ')'
            };
            
            scope.disabledClose = disabledClose;
            scope.close = close;
            
            function disabledClose () {
                popUpsManager.disabledPopUpById(scope.ngItem.id, function (status, data) {
                    if (status != 204) {
                        dialogHandler.alertError(status, data);
                    }
                });
                close();
            }
            
            function close () {
                $rootScope.$broadcast('app.pop-up-close', {});
            }
        }
    }
}