export default function textareaConfig ($provide) {
    "ngInject";
    $provide.decorator('textareaDirective', function ($delegate, $log) {
        var directive = $delegate[0];
        angular.extend(directive.link, {
            post: function (scope, element, attr, ctrl) {
                element.on("compositionupdate", function (e) {
                    element.triggerHandler('compositionend');
                });
            }
        });
        return $delegate;
    });
}