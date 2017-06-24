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
var AppPetTreatment = require('./app-pet-treatment');
var AppPoo = require('./app-poo');
var AppTreatment = require('./app-treatment');
var AppTreatmentCharge = require('./app-treatment-charge');
var AppUserPet = require('./app-user-pet');

var models = {
    Profile: Profile,
    AppCharge: AppCharge,
    AppMeal: AppMeal,
    AppMealCharge: AppMealCharge,
    AppPet: AppPet,
    AppPetImage: AppPetImage,
    AppPetMeal: AppPetMeal,
    AppPetTreatment: AppPetTreatment,
    AppPoo: AppPoo,
    AppTreatment: AppTreatment,
    AppTreatmentCharge: AppTreatmentCharge,
    AppUserPet: AppUserPet
};

module.exports = models;