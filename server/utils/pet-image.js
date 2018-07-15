var STD = require('../../../bridge/metadata/standards');
var OBJECTIFY = require('../../../core/server/utils/objectify');
var sequelize = require('../../../core/server/config/sequelize');

module.exports = {
    generateCountByUserQuery: function (options) {
        var query = `SELECT COUNT(*) AS count FROM AppPetImages AS petImage
        INNER JOIN AppPets AS pet ON petImage.petId = pet.id AND pet.deletedAt IS NULL
        INNER JOIN AppUserPets AS userPet ON userPet.petId = pet.id AND userPet.userId = ${options.userId}
        WHERE pet.deletedAt IS NULL`;

        if (options.id !== undefined) {
            query += ` AND petImage.id = ${options.id}`;
        }

        if (options.petId !== undefined) {
            query += ` AND petImage.petId = ${options.petId}`;
        }

        return query;
    },
    generateSelectByUserQuery: function (options) {
        var query = `SELECT petImage.*
        , ${OBJECTIFY.query.select('image', ['image'], Object.keys(sequelize.models.Image.attributes))}
        FROM AppPetImages AS petImage
        INNER JOIN AppPets AS pet ON petImage.petId = pet.id AND pet.deletedAt IS NULL
        INNER JOIN AppUserPets AS userPet ON userPet.petId = pet.id AND userPet.userId = ${options.userId}
        INNER JOIN Images AS image ON petImage.imageId = image.id
        WHERE pet.deletedAt IS NULL`;

        if (options.id !== undefined) {
            query += ` AND petImage.id = ${options.id}`;
        }

        if (options.petId !== undefined) {
            query += ` AND petImage.petId = ${options.petId}`;
        }

        if (options.last !== undefined) {
            query += ` AND petImage.${options.orderBy}`;
            if (options.sort == STD.common.DESC) {
                query += ` < ${options.last}`;
            } else {
                query += ` > ${options.last}`;
            }
        }

        query += ` ORDER BY pet.${options.orderBy} ${options.sort}
        LIMIT ${options.size}${options.offset ? ' OFFSET ' + options.offset : ''}`;

        return query;
    }
};