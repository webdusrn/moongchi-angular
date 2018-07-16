Background.$inject = ['$resource', 'appResources'];

export default function Background($resource, appResources) {
    "ngInject";

    return $resource(appResources.BACKGROUNDS, {}, {
        update: {
            method: 'PUT'
        },
        query: {
            isArray: false
        }
    })
}