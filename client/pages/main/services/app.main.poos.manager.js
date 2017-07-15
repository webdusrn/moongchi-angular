export default function poosManager (Poo, PetPoo, dialogHandler, statusHandler) {
    'ngInject';

    this.findPets = findPets;
    this.findPoos = findPoos;
    this.findPetById = findPetById;

    function findPetById (petId, callback) {
        PetPoo.get({
            id: petId
        }, function (data) {
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