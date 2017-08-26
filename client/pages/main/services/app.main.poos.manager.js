export default function poosManager (Poo, PetPoo, dialogHandler, statusHandler) {
    'ngInject';

    this.findPets = findPets;
    this.findPoos = findPoos;
    this.findPetById = findPetById;
    this.createPoo = createPoo;

    function createPoo (data, callback) {
        var body = {};
        if (data.petId !== undefined) body.petId = data.petId;
        if (data.pooType !== undefined) body.pooType = data.pooType;
        if (data.pooColor !== undefined) body.pooColor = data.pooColor;
        if (data.pooDate !== undefined) body.pooDate = data.pooDate;
        dialogHandler.validator(body, [
            "petId",
            "pooType",
            "pooColor",
            "pooDate"
        ], [
            "petId",
            "pooType",
            "pooColor",
            "pooDate"
        ], null, function (data) {
            var poo = new Poo(data);
            poo.$save(function (data) {
                callback(201, data);
            }, function (data) {
                statusHandler.active(data, callback);
            });
        });
    }

    function findPetById (petId, data, callback) {
        var query = {
            id: petId
        };
        if (data.year !== undefined) query.year = data.year;
        if (data.month !== undefined) query.month = data.month;
        PetPoo.get(query, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function findPets (query, callback) {
        PetPoo.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function findPoos (query, callback) {
        Poo.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }
}