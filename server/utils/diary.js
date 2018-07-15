var STD = require('../../../bridge/metadata/standards');
var OBJECTIFY = require('../../../core/server/utils/objectify');
var sequelize = require('../../../core/server/config/sequelize');

module.exports = {
    generateCountByUserQuery: function (options) {
        var query = `SELECT COUNT(*) AS count FROM (SELECT diary.id FROM AppDiaries AS diary
        INNER JOIN AppUserPets AS userPet ON userPet.petId = diary.petId AND userPet.userId = ${options.userId}
        INNER JOIN AppPets AS pet ON diary.petId = pet.id AND pet.deletedAt IS NULL
        WHERE diary.deletedAt IS NULL`;

        if (options.id !== undefined) {
            query += ` AND diary.id = ${options.id}`;
        }

        if (options.petId !== undefined) {
            query += ` AND diary.petId = ${options.petId}`;
        }

        if (options.diaryType !== undefined) {
            query += ` AND diary.diaryType = "${options.diaryType}"`;
        }

        query += ` GROUP BY diary.id) a`;

        return query;
    },
    generateSelectByUserQuery: function (options) {
        var query = `SELECT a.*, diaryImage.diaryId AS "images.diaryId"
        , ${OBJECTIFY.query.select('image', ['images'], Object.keys(sequelize.models.Image.attributes))}
        FROM (SELECT diary.*
        , ${OBJECTIFY.query.select('pet', ['pet'], Object.keys(sequelize.models.AppPet.attributes))}
        FROM AppDiaries AS diary
        INNER JOIN AppUserPets AS userPet ON userPet.petId = diary.petId AND userPet.userId = ${options.userId}
        INNER JOIN AppPets AS pet ON diary.petId = pet.id AND pet.deletedAt IS NULL
        WHERE diary.deletedAt IS NULL`;

        if (options.id !== undefined) {
            query += ` AND diary.id = ${options.id}`;
        }

        if (options.petId !== undefined) {
            query += ` AND diary.petId = ${options.petId}`;
        }

        if (options.diaryType !== undefined) {
            query += ` AND diary.diaryType = "${options.diaryType}"`;
        }

        if (options.last !== undefined) {
            query += ` AND diary.${options.orderBy}`;
            if (options.sort == STD.common.DESC) {
                query += ` < ${options.last}`;
            } else {
                query += ` > ${options.last}`;
            }
        }

        query += ` GROUP BY diary.id
        ORDER BY diary.${options.orderBy} ${options.sort}
        LIMIT ${options.size}${options.offset ? ' OFFSET ' + options.offset : ''}
        ) a
        LEFT JOIN AppDiaryImages AS diaryImage ON diaryImage.diaryId = a.id
        LEFT JOIN Images AS image ON diaryImage.imageId = image.id
        ORDER BY a.${options.orderBy} ${options.sort}`;

        return query;
    }
};