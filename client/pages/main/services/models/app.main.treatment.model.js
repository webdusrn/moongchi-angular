Treatment.$inject = ['$resource', 'appResources'];

export default function Treatment($resource, appResources) {
    "ngInject";

    return $resource(appResources.TREATMENTS + '/:id', {
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