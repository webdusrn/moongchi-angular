var path = require('path');
var fs = require('fs');
var sequelize = require('../../../../core/server/config/sequelize');
var Profile = require('./profile');
var AppCharge = require('./app-charge');
var AppMeal = require('./app-meal');
var AppMealCharge = require('./app-meal-charge');
var AppPet = require('./app-pet');
var AppPetImage = require('./app-pet-image');
var AppPetMeal = require('./app-pet-meal');
var AppPoo = require('./app-poo');
var AppTreatmentGroup = require('./app-treatment-group');
var AppTreatment = require('./app-treatment');
var AppUserPet = require('./app-user-pet');

var models = {
    Profile: Profile,
    AppCharge: AppCharge,
    AppMeal: AppMeal,
    AppMealCharge: AppMealCharge,
    AppPet: AppPet,
    AppPetImage: AppPetImage,
    AppPetMeal: AppPetMeal,
    AppPoo: AppPoo,
    AppTreatmentGroup: AppTreatmentGroup,
    AppTreatment: AppTreatment,
    AppUserPet: AppUserPet
};

module.exports = models;