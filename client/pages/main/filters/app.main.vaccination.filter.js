export default function vaccination (metaManager) {
    'ngInject';

    var TREATMENT = metaManager.std.treatment;
    
    return function (pet, value1, value2, value3, value4) {
        if (pet && pet.treatments) {
            var level = 0;
            for (var i=0; i<pet.treatments.length; i++) {
                var treatmentType = pet.treatments[i].treatmentType;
                if (treatmentType == TREATMENT.treatmentTypeVaccination1 && level < 1) {
                    level = 1;
                } else if (treatmentType == TREATMENT.treatmentTypeVaccination2 && level < 2) {
                    level = 2;
                } else if (treatmentType == TREATMENT.treatmentTypeVaccination3 && level < 3) {
                    level = 3;
                    break;
                }
            }
            if (level == 1) {
                return value1;
            } else if (level == 2) {
                return value2;
            } else if (level == 3) {
                return value3;
            } else {
                return value4;
            }
        } else {
            return value4;
        }
    }
}