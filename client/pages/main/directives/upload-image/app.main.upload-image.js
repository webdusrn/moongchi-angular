export default function uploadImage ($rootScope, FileUploader, uploadManager, metaManager, dialogHandler, modalHandler) {
    'ngInject';

    var templatePath = metaManager.std.templatePath;

    FileUploader.FileSelect.prototype.isEmptyAfterSelection = function () {
        return true;
    };

    return {
        restrict: 'AE',
        scope: {
            ngModel: '=',
            ngFolder: '@'
        },
        templateUrl: templatePath + 'main/directives/upload-image/app.main.upload-image.html',
        link: function (scope, element, attr) {
            scope.removeItem = removeItem;

            scope.uploader = new FileUploader({
                onAfterAddingAll: function (items) {
                    // var file = items[0]._file;
                    var files = [];
                    items.forEach(function (item) {
                        files.push(item._file);
                    });
                    uploadManager.uploadImages(files, scope.ngFolder, function (status, data) {
                        if (status == 201) {
                            scope.ngModel = scope.ngModel.concat(data.images);
                        } else {
                            dialogHandler.alertError(status, data);
                        }
                    });
                    scope.uploader.clearQueue();
                }
            });

            function removeItem (index) {
                scope.ngModel.splice(index, 1);
            }
        }
    }
}