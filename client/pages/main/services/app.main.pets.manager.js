export default function petsManager (Pet) {
    'ngInject';

    this.findPets = findPets;

    function findPets (query, callback) {
        Pet.query(query, function (data) {
            callback(200, data);
        }, function (data) {
            callback(data.status, data.data);
        });
    }
}