var path = require('path');
var fs = require('fs');
var sequelize = require('../../../../core/server/config/sequelize');
var Profile = require('./profile');
var AppBackground = require('./app-background');
var AppCharge = require('./app-charge');
var AppMeal = require('./app-meal');
var AppPet = require('./app-pet');
var AppPetImage = require('./app-pet-image');
var AppPetMeal = require('./app-pet-meal');
var AppPoo = require('./app-poo');
var AppTreatmentGroup = require('./app-treatment-group');
var AppTreatment = require('./app-treatment');
var AppMedicine = require('./app-medicine');
var AppUserPet = require('./app-user-pet');

var models = {
    Profile: Profile,
    AppBackground: AppBackground,
    AppCharge: AppCharge,
    AppMeal: AppMeal,
    AppPet: AppPet,
    AppPetImage: AppPetImage,
    AppPetMeal: AppPetMeal,
    AppPoo: AppPoo,
    AppTreatmentGroup: AppTreatmentGroup,
    AppTreatment: AppTreatment,
    AppMedicine: AppMedicine,
    AppUserPet: AppUserPet
};

module.exports = models;