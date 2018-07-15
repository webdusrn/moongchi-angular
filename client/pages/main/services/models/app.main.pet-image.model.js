PetImage.$inject = ['$resource', 'appResources'];

export default function PetImage($resource, appResources) {
    "ngInject";

    return $resource(appResources.PET_IMAGES + '/:id', {
        id: '@id'
    }, {
        query: {
            isArray: false
        }
    })
}