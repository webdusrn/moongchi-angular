export default function treatmentsManager (TreatmentGroup, Treatment, statusHandler, metaManager) {
    'ngInject';

    var MAGIC = metaManager.std.magic;

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
        if (data.treatmentGroupId !== undefined) body.treatmentGroupId = data.treatmentGroupId;
        if (data.petId !== undefined) body.petId = data.petId;
        if (data.treatmentType !== undefined) body.treatmentType = data.treatmentType;
        if (data.treatmentPrice !== undefined) body.treatmentPrice = data.treatmentPrice;
        if (data.treatmentMemo !== undefined) body.treatmentMemo = data.treatmentMemo;
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
        if (data.petId !== undefined) body.petId = data.petId;
        if (data.treatmentType !== undefined) body.treatmentType = data.treatmentType;
        if (data.treatmentPrice !== undefined) body.treatmentPrice = data.treatmentPrice || MAGIC.reset;
        if (data.treatmentMemo !== undefined) body.treatmentMemo = data.treatmentMemo || MAGIC.reset;
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
        if (data.hospitalName !== undefined) body.hospitalName = data.hospitalName;
        if (data.treatmentAt !== undefined) body.treatmentAt = data.treatmentAt;
        if (data.treatmentTotalPrice !== undefined) body.treatmentTotalPrice = data.treatmentTotalPrice;
        if (data.petIds !== undefined) body.petIds = data.petIds;
        if (data.treatmentTypes !== undefined) body.treatmentTypes = data.treatmentTypes;
        if (data.treatmentPrices !== undefined) body.treatmentPrices = data.treatmentPrices;
        if (data.treatmentMemos !== undefined) body.treatmentMemos = data.treatmentMemos;
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
        if (data.hospitalName !== undefined) body.hospitalName = data.hospitalName || MAGIC.reset;
        if (data.treatmentAt !== undefined) body.treatmentAt = data.treatmentAt || MAGIC.reset;
        if (data.treatmentTotalPrice !== undefined) body.treatmentTotalPrice = data.treatmentTotalPrice || MAGIC.reset;
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