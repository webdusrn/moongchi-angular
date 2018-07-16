PetImage.$inject = ['$resource', 'appResources'];

export default function PetImage($resource, appResources) {
    "ngInject";

    return $resource(appResources.PET_IMAGES + '/:id', {
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