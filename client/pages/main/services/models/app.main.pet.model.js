Pet.$inject = ['$resource', 'appResources'];

export default function Pet($resource, appResources) {
    "ngInject";

    return $resource(appResources.PETS + '/:id', {
        id: '@id'
    }, {
        query: {
            isArray: false
        }
    })
}