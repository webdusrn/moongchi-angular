Poo.$inject = ['$resource', 'appResources'];

export default function Poo($resource, appResources) {
    "ngInject";

    return $resource(appResources.POOS + '/:id', {
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