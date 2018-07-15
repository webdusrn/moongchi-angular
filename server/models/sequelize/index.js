var path = require('path');
var fs = require('fs');
var sequelize = require('../../../../core/server/config/sequelize');
var Profile = require('./profile');

var AppBackground = require('./app-background');
var AppPet = require('./app-pet');
var AppUserPet = require('./app-user-pet');
var AppTreatmentGroup = require('./app-treatment-group');
var AppTreatment= require('./app-treatment');
var AppPetImage = require('./app-pet-image');
var AppDiary = require('./app-diary');
var AppDiaryImage = require('./app-diary-image');

var models = {
    Profile: Profile,
    AppBackground: AppBackground,
    AppPet: AppPet,
    AppUserPet: AppUserPet,
    AppTreatmentGroup: AppTreatmentGroup,
    AppTreatment: AppTreatment,
    AppPetImage: AppPetImage,
    AppDiary: AppDiary,
    AppDiaryImage: AppDiaryImage
};

module.exports = models;