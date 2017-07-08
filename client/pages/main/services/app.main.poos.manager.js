export default function poosManager (PetPoo, dialogHandler, statusHandler) {
    'ngInject';

    this.findPets = findPets;
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
}