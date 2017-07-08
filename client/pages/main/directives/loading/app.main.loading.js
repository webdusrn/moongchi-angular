export default function loading ($rootScope, $timeout, metaManager) {
    'ngInject';
    
    var templatePath = metaManager.std.templatePath;
    
    return {
        restrict: 'AE',
        scope: {
            progress: '=',
            ngId: '@'
        },
        templateUrl: templatePath + 'main/directives/loading/app.main.loading.html',
        link: function (scope, element, attr) {
            var bar = null;

            apply(function () {
                $timeout(function () {
                    bar = new ProgressBar.Path('#' + scope.ngId, {
                        easing: 'easeInOut',
                        duration: 100
                    });
                    bar.set(0);
                });
            });

            scope.$watch('progress', function (newVal, oldVal) {
                if (newVal != oldVal && bar) {
                    apply(function () {
                        bar.animate(newVal / 100);
                    });
                }
            });

            function apply (func) {
                if ($rootScope.$$phase == '$apply' || $rootScope.$$phase == '$digest') {
                    func();
                } else {
                    scope.$apply(function () {
                        func();
                    });
                }
            }
        }
    }
}