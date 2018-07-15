TreatmentGroup.$inject = ['$resource', 'appResources'];

export default function TreatmentGroup($resource, appResources) {
    "ngInject";

    return $resource(appResources.TREATMENT_GROUPS + '/:id', {
        id: '@id'
    }, {
        query: {
            isArray: false
        }
    })
}