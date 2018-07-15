PetSeries.$inject = ['$resource', 'appResources'];

export default function PetSeries($resource, appResources) {
    "ngInject";

    return $resource(appResources.PET_SERIES + '/:id', {
        id: '@id'
    }, {
        query: {
            isArray: true
        }
    })
}