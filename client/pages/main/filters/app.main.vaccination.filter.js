export default function vaccination($filter, metaManager) {
    "ngInject";

    var t = $filter('translate');
    var treatmentTypeVaccination = metaManager.std.treatment.treatmentTypeVaccination;

    return function (pet) {
        var vaccinationNum = 0;
        if (pet.treatments) {
            pet.treatments.forEach(function (treatment) {
                if (treatment.treatmentType == treatmentTypeVaccination) {
                    vaccinationNum++;
                }
            });
            if (vaccinationNum > 0) {
                return t('vaccination' + vaccinationNum) + ' ' + t('vaccination');
            } else {
                return t('noVaccination');
            }
        } else {
            return t('noVaccination');
        }
    };
}