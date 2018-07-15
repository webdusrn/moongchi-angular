export default function treatmentsManager (TreatmentGroup, Treatment, statusHandler) {
    'ngInject';

    this.findTreatmentGroups = findTreatmentGroups;
    this.findTreatmentGroup = findTreatmentGroup;
    this.createTreatmentGroup = createTreatmentGroup;
    this.updateTreatmentGroup = updateTreatmentGroup;
    this.deleteTreatmentGroup = deleteTreatmentGroup;
    this.createTreatment = createTreatment;
    this.updateTreatment = updateTreatment;
    this.deleteTreatment = deleteTreatment;

    function createTreatment (data, callback) {
        var body = {};

        var treatment = new Treatment(body);
        treatment.$save(function (data) {
            callback(201, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function updateTreatment (data, callback) {
        var where = {id: data.id};
        var body = {};

        Treatment.update(where, body, function () {
            callback(204);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function deleteTreatment (treatment, callback) {
        treatment = new Treatment(treatment);
        treatment.$remove(function () {
            callback(204);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function createTreatmentGroup (data, callback) {
        var body = {};

        var treatmentGroup = new TreatmentGroup(body);
        treatmentGroup.$save(function (data) {
            callback(201, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function updateTreatmentGroup (data, callback) {
        var where = {id: data.id};
        var body = {};

        TreatmentGroup.update(where, body, function () {
            callback(204);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function deleteTreatmentGroup (treatmentGroup, callback) {
        treatmentGroup = new TreatmentGroup(treatmentGroup);
        treatmentGroup.$remove(function () {
            callback(204);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function findTreatmentGroups (query, callback) {
        TreatmentGroup.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function findTreatmentGroup (treatmentGroupId, callback) {
        TreatmentGroup.get({
            id: treatmentGroupId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }
}