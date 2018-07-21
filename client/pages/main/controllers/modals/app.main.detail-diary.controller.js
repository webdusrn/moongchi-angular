export default function DetailDiaryCtrl ($scope, $rootScope, $filter, metaManager, dialogHandler, loadingHandler, diariesManager, uploadManager, modalHandler) {
    'ngInject';

    var vm = $scope.vm;
    var DIARY = metaManager.std.diary;
    var FILE = metaManager.std.file;
    var date = $filter('date');
    var $target = $('#detail-diary-wrap');

    $scope.close = close;
    $scope.createDiary = createDiary;
    $scope.updateDiary = updateDiary;
    $scope.deleteDiary = deleteDiary;

    $scope.enumDiaryTypes = DIARY.enumDiaryTypes.slice();
    $scope.folder = FILE.folderDiary;

    $scope.isCreate = null;
    $scope.isOpen = false;
    $scope.form = null;

    $scope.$on('open-detail-diary', function (event, args) {
        if (args.diary) {
            $scope.form = generateForm(args.diary);
            $scope.isOpen = true;
            $scope.isCreate = false;
            modalHandler.focus($target);
        }
    });

    $scope.$on('open-create-diary', function (event, args) {
        $scope.form = {
            diaryAt: date(new Date(), 'yyyy-MM-dd'),
            images: []
        };
        $scope.isOpen = true;
        $scope.isCreate = true;
        modalHandler.focus($target);
    });

    function createDiary () {
        var body = generateBody($scope.form);
        diariesManager.createDiary(body, function (status, data) {
            if (status == 201) {
                $rootScope.$broadcast('create-diary', {
                    diary: data
                });
                close();
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function updateDiary () {
        var body = generateBody($scope.form);
        diariesManager.updateDiary(body, function (status, data) {
            if (status == 204) {
                $rootScope.$broadcast('update-diary', {});
                close();
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function deleteDiary () {
        diariesManager.deleteDiary($scope.form, function (status, data) {
            if (status == 204) {
                $rootScope.$broadcast('delete-diary', {});
                close();
            } else {
                dialogHandler.alertError(status, data);
            }
        });
    }

    function generateForm (data) {
        var form = angular.copy(data);
        if (form.diaryAt) {
            var diaryAt = new Date(form.diaryAt);
            form.diaryAt = date(diaryAt, 'yyyy-MM-dd');
        }
        return form;
    }

    function generateBody (data) {
        var body = angular.copy(data);
        var imageIds = [];
        body.images.forEach(function (image) {
            imageIds.push(image.id);
        });
        if (imageIds.length) body.imageIds = imageIds.join(', ');
        if (body.pet) body.petId = body.pet.id;
        return body;
    }

    modalHandler.eventBind($target, function () {
        vm.apply(function () {
            close();
        });
    });

    function close () {
        $scope.isOpen = false;
        $scope.isCreate = null;
        $scope.form = {};
    }
}