export default function backgroundsManager (Background, statusHandler) {
    "ngInject";

    this.findBackgrounds = findBackgrounds;

    function findBackgrounds (query, callback) {
        Background.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }
}