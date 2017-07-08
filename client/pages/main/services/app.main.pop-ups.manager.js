export default function popUpsManager (PopUp, statusHandler) {
    'ngInject';

    this.findCurrentPopUp = findCurrentPopUp;
    this.disabledPopUpById = disabledPopUpById;

    function findCurrentPopUp (callback) {
        PopUp.get({}, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function disabledPopUpById (popUpId, callback) {
        PopUp.update({
            id: popUpId
        }, {}, function (data) {
            callback(204);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }
}