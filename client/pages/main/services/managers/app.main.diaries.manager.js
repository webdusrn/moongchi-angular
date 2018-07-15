export default function diariesManager (Diary, statusHandler) {
    'ngInject';

    this.findDiaries = findDiaries;
    this.findDiary = findDiary;
    this.createDiary = createDiary;
    this.updateDiary = updateDiary;
    this.deleteDiary = deleteDiary;

    function createDiary (data, callback) {
        var body = {};

        var diary = new Diary(body);
        diary.$save(function (data) {
            callback(201, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function updateDiary (data, callback) {
        var where = {id: data.id};
        var body = {};

        Diary.update(where, body, function () {
            callback(204);
        }, function () {
            statusHandler.active(data, callback);
        })
    }

    function deleteDiary (diary, callback) {
        diary = new Diary(diary);
        diary.$remove(function () {
            callback(204);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function findDiary (diaryId, callback) {
        Diary.get({
            id: diaryId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function findDiaries (query, callback) {
        Diary.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }
}