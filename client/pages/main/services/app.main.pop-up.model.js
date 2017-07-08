PopUp.$inject = ['$resource', 'appResources'];

export default function PopUp($resource, appResources) {
    "ngInject";

    return $resource(appResources.POP_UPS + '/:id', {
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