export default function diariesManager (Diary, statusHandler, metaManager) {
    'ngInject';

    var MAGIC = metaManager.std.magic;

    this.findDiaries = findDiaries;
    this.findDiary = findDiary;
    this.createDiary = createDiary;
    this.updateDiary = updateDiary;
    this.deleteDiary = deleteDiary;

    function createDiary (data, callback) {
        var body = {};
        if (data.petId !== undefined) body.petId = data.petId;
        if (data.diaryType !== undefined) body.diaryType = data.diaryType;
        if (data.diaryContent !== undefined) body.diaryContent = data.diaryContent;
        if (data.diaryAt !== undefined) body.diaryAt = data.diaryAt;
        if (data.imageIds !== undefined) body.imageIds = data.imageIds;
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
        if (data.diaryType !== undefined) body.diaryType = data.diaryType;
        if (data.diaryContent !== undefined) body.diaryContent = data.diaryContent || MAGIC.reset;
        if (data.diaryAt !== undefined) body.diaryAt = data.diaryAt;
        if (data.imageIds !== undefined) body.imageIds = data.imageIds || MAGIC.reset;
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