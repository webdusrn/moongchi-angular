export default function reportsManager (Report, dialogHandler, statusHandler) {
    'ngInject';

    this.findReportById = findReportById;
    this.findReports = findReports;
    this.createReport = createReport;

    function findReportById (reportId, callback) {
        Report.get({
            id: reportId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function findReports (query, callback) {
        Report.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function createReport (data, callback) {
        var body = {};
        if (data.email !== undefined) body.email = data.email;
        if (data.body !== undefined) body.body = data.body;
        dialogHandler.validator(body, [
            'email',
            'body'
        ], [
            'body'
        ], null, function (data) {
            var report = new Report(data);
            report.$save(function (data) {
                callback(201, data);
            }, function (data) {
                statusHandler.active(data, callback);
            });
        });
    }
}