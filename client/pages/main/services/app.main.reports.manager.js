export default function reportsManager (Report, dialogHandler, statusHandler) {
    'ngInject';

    this.findReports = findReports;

    function findReports (query, callback) {
        Report.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }
}