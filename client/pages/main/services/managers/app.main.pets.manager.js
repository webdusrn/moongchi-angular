export default function petsManager (Pet, PetImage, PetSeries, statusHandler, metaManager) {
    'ngInject';

    var MAGIC = metaManager.std.magic;

    this.findPets = findPets;
    this.findPet = findPet;
    this.createPet = createPet;
    this.updatePet = updatePet;
    this.deletePet = deletePet;
    this.findPetImages = findPetImages;
    this.findPetImage = findPetImage;
    this.createPetImage = createPetImage;
    this.deletePetImage = deletePetImage;
    this.findPetSeries = findPetSeries;

    function createPet (data, callback) {
        var body = {};
        if (data.petType !== undefined) body.petType = data.petType;
        if (data.petSeries !== undefined) body.petSeries = data.petSeries;
        if (data.petGender !== undefined) body.petGender = data.petGender;
        if (data.petName !== undefined) body.petName = data.petName;
        if (data.birthAt !== undefined) body.birthAt = data.birthAt;
        if (data.isVaccination1 !== undefined) body.isVaccination1 = data.isVaccination1;
        if (data.isVaccination2 !== undefined) body.isVaccination2 = data.isVaccination2;
        if (data.isVaccination3 !== undefined) body.isVaccination3 = data.isVaccination3;
        if (data.isNeuter !== undefined) body.isNeuter = data.isNeuter;
        if (data.imageId !== undefined) body.imageId = data.imageId;

        var pet = new Pet(body);
        pet.$save(function (data) {
            callback(201, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function updatePet (data, callback) {
        var where = {id: data.id};
        var body = {};
        if (data.petSeries !== undefined) body.petSeries = data.petSeries || MAGIC.reset;
        if (data.petGender !== undefined) body.petGender = data.petGender;
        if (data.petName !== undefined) body.petName = data.petName;
        if (data.birthAt !== undefined) body.birthAt = data.birthAt || MAGIC.reset;
        if (data.isVaccination1 !== undefined) body.isVaccination1 = data.isVaccination1;
        if (data.isVaccination2 !== undefined) body.isVaccination2 = data.isVaccination2;
        if (data.isVaccination3 !== undefined) body.isVaccination3 = data.isVaccination3;
        if (data.isNeuter !== undefined) body.isNeuter = data.isNeuter;
        if (data.imageId !== undefined) body.imageId = data.imageId || MAGIC.reset;

        Pet.update(where, body, function () {
            callback(204);
        }, function () {
            statusHandler.active(data, callback);
        })
    }

    function deletePet (pet, callback) {
        pet = new Pet(pet);
        pet.$remove(function () {
            callback(204);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function findPet (petId, callback) {
        Pet.get({
            id: petId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function findPets (query, callback) {
        if (query.petSeries === null) query.petSeries = MAGIC.empty;
        Pet.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function createPetImage (data, callback) {
        var body = {};
        if (data.petId !== undefined) body.petId = data.petId;
        if (data.imageId !== undefined) body.imageId = data.imageId;
        var petImage = new PetImage(body);
        petImage.$save(function (data) {
            callback(201, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function deletePetImage (petImage, callback) {
        petImage = new PetImage(petImage);
        petImage.$remove(function () {
            callback(204);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function findPetImages (query, callback) {
        PetImage.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function findPetImage (petImageId, callback) {
        PetImage.get({
            id: petImageId
        }, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function findPetSeries (query, callback) {
        PetSeries.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }
}