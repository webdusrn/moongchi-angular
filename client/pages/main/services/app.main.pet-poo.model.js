PetPoo.$inject = ['$resource', 'appResources'];

export default function PetPoo($resource, appResources) {
    "ngInject";

    return $resource(appResources.PET_POOS + '/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        },
        query: {
            isArray: false
        }
    })
}