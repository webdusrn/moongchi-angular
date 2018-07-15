Diary.$inject = ['$resource', 'appResources'];

export default function Diary($resource, appResources) {
    "ngInject";

    return $resource(appResources.DIARIES + '/:id', {
        id: '@id'
    }, {
        query: {
            isArray: false
        }
    })
}