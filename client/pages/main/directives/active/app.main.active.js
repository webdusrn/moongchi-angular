export default function active () {
    "ngInject";
    return {
        restrict: 'A',
        scope: {
            active: '='
        },
        link: function (scope, element, attr) {
            if (scope.active) {
                scope.active();
            }
        }
    }
}