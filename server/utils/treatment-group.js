var STD = require('../../../bridge/metadata/standards');
var OBJECTIFY = require('../../../core/server/utils/objectify');
var sequelize = require('../../../core/server/config/sequelize');

module.exports = {
    generateCountByUserQuery: function (options) {
        var query = `SELECT COUNT(*) AS count FROM
        (SELECT treatmentGroup.id FROM AppTreatmentGroups AS treatmentGroup
        INNER JOIN AppTreatments AS treatment ON treatment.treatmentGroupId = treatmentGroup.id AND treatment.deletedAt IS NULL${options.petId ? ' AND treatment.petId = ' + options.petId : ''}
        INNER JOIN AppPets AS pet ON treatment.petId = pet.id AND pet.deletedAt IS NULL
        INNER JOIN AppUserPets AS userPet ON userPet.petId = treatment.petId AND userPet.userId = ${options.userId}
        WHERE pet.deletedAt IS NULL`;

        if (options.id !== undefined) {
            query += ` AND treatmentGroup.id = ${options.id}`;
        }

        if (options.treatmentType !== undefined) {
            query += ` AND treatment.treatmentType = "${options.treatmentType}"`;
        }

        if (options.searchField !== undefined && options.searchItem !== undefined) {
            query += ` AND treatmentGroup.${options.searchField} LIKE "%${options.searchItem}%"`;
        }

        query += ` GROUP BY treatmentGroup.id) a`;

        return query;
    },
    generateSelectByUserQuery: function (options) {
        var query = `SELECT a.*
        , ${OBJECTIFY.query.select('treatment', ['treatments'], Object.keys(sequelize.models.AppTreatment.attributes))}
        , ${OBJECTIFY.query.select('pet', ['treatments', 'pet'], Object.keys(sequelize.models.AppPet.attributes))}
        , ${OBJECTIFY.query.select('image', ['treatments', 'pet', 'image'], Object.keys(sequelize.models.Image.attributes))}
        FROM (SELECT treatmentGroup.* FROM AppTreatmentGroups AS treatmentGroup
        INNER JOIN AppTreatments AS treatment ON treatment.treatmentGroupId = treatmentGroup.id AND treatment.deletedAt IS NULL${options.petId ? ' AND treatment.petId = ' + options.petId : ''}
        INNER JOIN AppPets AS pet ON treatment.petId = pet.id AND pet.deletedAt IS NULL
        INNER JOIN AppUserPets AS userPet ON userPet.petId = treatment.petId AND userPet.userId = ${options.userId}
        WHERE pet.deletedAt IS NULL`;

        if (options.id !== undefined) {
            query += ` AND treatmentGroup.id = ${options.id}`;
        }

        if (options.treatmentType !== undefined) {
            query += ` AND treatment.treatmentType = "${options.treatmentType}"`;
        }

        if (options.searchField !== undefined && options.searchItem !== undefined) {
            query += ` AND treatmentGroup.${options.searchField} LIKE "%${options.searchItem}%"`;
        }

        if (options.last !== undefined) {
            query += ` AND treatmentGroup.${options.orderBy}`;
            if (options.sort == STD.common.DESC) {
                query += ` < ${options.last}`;
            } else {
                query += ` > ${options.last}`;
            }
        }

        query += ` GROUP BY treatmentGroup.id
        ORDER BY treatmentGroup.${options.orderBy} ${options.sort}
        LIMIT ${options.size}${options.offset ? ' OFFSET ' + options.offset : ''}
        ) a
        INNER JOIN AppTreatments AS treatment ON treatment.treatmentGroupId = a.id
        INNER JOIN AppPets AS pet ON treatment.petId = pet.id
        LEFT JOIN Images AS image ON pet.imageId = image.id
        ORDER BY a.${options.orderBy} ${options.sort}`;

        return query;
    }
};