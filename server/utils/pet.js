var STD = require('../../../bridge/metadata/standards');
var OBJECTIFY = require('../../../core/server/utils/objectify');
var sequelize = require('../../../core/server/config/sequelize');

var TREATMENT = STD.treatment;

module.exports = {
    generateCountByUserQuery: function (options) {
        var query = `SELECT COUNT(*) AS count FROM (SELECT pet.id FROM AppPets AS pet
        INNER JOIN AppUserPets AS userPet ON userPet.petId = pet.id AND userPet.userId = ${options.userId}`;

        if (options.vaccination !== undefined) {
            if (options.vaccination == 1) {
                query += ` INNER JOIN AppTreatments AS treatment ON treatment.petId = pet.id AND treatment.deletedAt IS NULL AND treatment.treatmentType = "${STD.treatment.treatmentTypeVaccination1}"`;
            } else if (options.vaccination == 2) {
                query += ` INNER JOIN AppTreatments AS treatment ON treatment.petId = pet.id AND treatment.deletedAt IS NULL AND treatment.treatmentType = "${STD.treatment.treatmentTypeVaccination2}"`;
            } else if (options.vaccination == 3) {
                query += ` INNER JOIN AppTreatments AS treatment ON treatment.petId = pet.id AND treatment.deletedAt IS NULL AND treatment.treatmentType = "${STD.treatment.treatmentTypeVaccination3}"`;
            }
        }

        if (options.neuter !== undefined) {
            if (options.neuter) {
                query += ` INNER JOIN AppTreatments AS neuter ON neuter.petId = pet.id AND neuter.deletedAt IS NULL AND neuter.treatmentType = "${STD.treatment.treatmentTypeNeuter}"`;
            } else {
                query += ` LEFT JOIN AppTreatments AS neuter ON neuter.petId = pet.id AND neuter.deletedAt IS NULL AND neuter.treatmentType = "${STD.treatment.treatmentTypeNeuter}"`;
            }
        }

        query += ' WHERE pet.deletedAt IS NULL';

        if (options.id !== undefined) {
            query += ` AND pet.id = ${options.id}`;
        }

        if (options.searchField !== undefined && options.searchItem !== undefined) {
            query += ` AND pet.${options.searchField} LIKE "%${options.searchItem}%"`;
        }

        if (options.petGender !== undefined) {
            query += ` AND pet.petGender = "${options.petGender}"`;
        }

        if (options.petSeries !== undefined) {
            query += ` AND pet.petSeries = "${options.petSeries}"`;
        }

        if (options.neuter !== undefined && !options.neuter) {
            query += ` AND neuter.id IS NULL`;
        }

        query += ' GROUP BY pet.id) a';

        return query;
    },
    generateSelectByUserQuery: function (options) {
        var query = `SELECT a.*
        , ${OBJECTIFY.query.select('image', ['image'], Object.keys(sequelize.models.Image.attributes))}
        , ${OBJECTIFY.query.select('treatment', ['treatments'], Object.keys(sequelize.models.AppTreatment.attributes))}
        FROM (SELECT pet.*
        FROM AppPets AS pet
        INNER JOIN AppUserPets AS userPet ON userPet.petId = pet.id AND userPet.userId = ${options.userId}`;

        if (options.vaccination !== undefined) {
            if (options.vaccination == 1) {
                query += ` INNER JOIN AppTreatments AS treatment ON treatment.petId = pet.id AND treatment.deletedAt IS NULL AND treatment.treatmentType = "${STD.treatment.treatmentTypeVaccination1}"`;
            } else if (options.vaccination == 2) {
                query += ` INNER JOIN AppTreatments AS treatment ON treatment.petId = pet.id AND treatment.deletedAt IS NULL AND treatment.treatmentType = "${STD.treatment.treatmentTypeVaccination2}"`;
            } else if (options.vaccination == 3) {
                query += ` INNER JOIN AppTreatments AS treatment ON treatment.petId = pet.id AND treatment.deletedAt IS NULL AND treatment.treatmentType = "${STD.treatment.treatmentTypeVaccination3}"`;
            }
        }

        if (options.neuter !== undefined) {
            if (options.neuter) {
                query += ` INNER JOIN AppTreatments AS neuter ON neuter.petId = pet.id AND neuter.deletedAt IS NULL AND neuter.treatmentType = "${STD.treatment.treatmentTypeNeuter}"`;
            } else {
                query += ` LEFT JOIN AppTreatments AS neuter ON neuter.petId = pet.id AND neuter.deletedAt IS NULL AND neuter.treatmentType = "${STD.treatment.treatmentTypeNeuter}"`;
            }
        }

        query += ' WHERE pet.deletedAt IS NULL';

        if (options.id !== undefined) {
            query += ` AND pet.id = ${options.id}`;
        }

        if (options.searchField !== undefined && options.searchItem !== undefined) {
            query += ` AND pet.${options.searchField} LIKE "%${options.searchItem}%"`;
        }

        if (options.petGender !== undefined) {
            query += ` AND pet.petGender = "${options.petGender}"`;
        }

        if (options.petSeries !== undefined) {
            query += ` AND pet.petSeries = "${options.petSeries}"`;
        }

        if (options.neuter !== undefined && !options.neuter) {
            query += ` AND neuter.id IS NULL`;
        }

        if (options.last !== undefined) {
            query += ` AND pet.${options.orderBy}`;
            if (options.sort == STD.common.DESC) {
                query += ` < ${options.last}`;
            } else {
                query += ` > ${options.last}`;
            }
        }

        query += ` ORDER BY pet.${options.orderBy} ${options.sort}
        LIMIT ${options.size}${options.offset ? ' OFFSET ' + options.offset : ''}
        ) a
        LEFT JOIN Images AS image ON a.imageId = image.id AND image.deletedAt IS NULL
        LEFT JOIN AppTreatments AS treatment ON treatment.petId = a.id AND treatment.deletedAt IS NULL AND treatment.treatmentType IN(${this.returnPetTreatmentTypesQuery()})
        ORDER BY a.${options.orderBy} ${options.sort}`;

        return query;
    },
    returnPetTreatmentTypesQuery: function () {
        var query = '';

        TREATMENT.petTreatmentTypes.forEach(function (treatmentType, index) {
            if (index) query += ', ';
            query += '"' + treatmentType + '"';
        });

        return query;
    }
};