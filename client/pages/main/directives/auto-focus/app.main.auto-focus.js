export default function autoFocus () {
    "ngInject";
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.focus();
        }
    }
}