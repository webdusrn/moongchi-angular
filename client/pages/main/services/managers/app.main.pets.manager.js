export default function petsManager (Pet, PetImage, PetSeries, statusHandler) {
    'ngInject';

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
        Pet.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            statusHandler.active(data, callback);
        });
    }

    function createPetImage (data, callback) {
        var body = {};

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