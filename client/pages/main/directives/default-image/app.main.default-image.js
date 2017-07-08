export default function defaultImage (metaManager) {
    'ngInject';

    var templatePath = metaManager.std.templatePath;
    var enumDefaultImages = angular.copy(metaManager.std.pet.enumDefaultImages);

    return {
        restrict: 'AE',
        scope: {
            ngId: '='
        },
        templateUrl: templatePath + 'main/directives/default-image/app.main.default-image.html',
        link: function (scope, element, attr) {
            var defaultImage = enumDefaultImages[scope.ngId % enumDefaultImages.length];
            scope.style = {
                'background-image': 'url(/pages/main/assets/images/' + defaultImage + ')'
            };
        }
    }
}