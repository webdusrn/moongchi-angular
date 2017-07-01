export default function petsManager (Pet, dialogHandler, statusHandler) {
    'ngInject';

    this.findPets = findPets;
    this.findPetById = findPetById;
    this.createPet = createPet;

    function findPetById (petId, callback) {
        Pet.get({
            id: petId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function findPets (query, callback) {
        Pet.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function createPet (data, callback) {
        var body = {};
        if (data.petType !== undefined) body.petType = data.petType;
        if (data.petName !== undefined) body.petName = data.petName;
        if (data.petSeries !== undefined) body.petSeries = data.petSeries;
        if (data.petGender !== undefined) body.petGender = data.petGender;
        if (data.petBirthDate !== undefined) body.petBirthDate = data.petBirthDate;
        if (data.imageId !== undefined) body.imageId = data.imageId;
        if (data.treatmentArray !== undefined) body.treatmentArray = data.treatmentArray;
        dialogHandler.validator(body, [
            'petType',
            'petName',
            'petSeries',
            'petGender',
            'petBirthDate',
            'imageId',
            'treatmentArray'
        ], [
            'petName',
            'petGender',
            'petBirthDate'
        ], null, function (data) {
            var pet = new Pet(data);
            pet.$save(function (data) {
                callback(201, data);
            }, function (data) {
                statusHandler.active(data, callback);
            });
        });
    }
}