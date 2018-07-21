export default function fileOver () {
    "ngInject";

    return {
        'restrict': 'AE',
        'link': function (scope, element, attr) {
            element.on('dragleave', function () {
                $(this).removeClass('file-over');
            });
        }
    }
}