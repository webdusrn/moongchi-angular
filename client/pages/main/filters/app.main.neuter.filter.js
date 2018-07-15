export default function neuter (metaManager) {
    'ngInject';

    var TREATMENT = metaManager.std.treatment;

    return function (pet, value1, value2) {
        if (pet && pet.treatments) {
            for (var i=0; i<pet.treatments.length; i++) {
                if (pet.treatments[i].treatmentType == TREATMENT.treatmentTypeNeuter) {
                    return value1;
                }
            }
            return value2;
        } else {
            return value2;
        }
    }
}