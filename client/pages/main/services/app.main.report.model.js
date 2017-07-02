Report.$inject = ['$resource', 'appResources'];

export default function Report($resource, appResources) {
    "ngInject";

    return $resource(appResources.REPORTS + '/:id', {
        id: '@id'
    }, {
        query: {
            isArray: false
        }
    })
}