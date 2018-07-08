var path = require('path');
var fs = require('fs');
var sequelize = require('../../../../core/server/config/sequelize');
var Profile = require('./profile');
var AppBackground = require('./app-background');
var AppPopUp = require('./app-pop-up');
var AppUserPopUp = require('./app-user-pop-up');

var models = {
    Profile: Profile,
    AppBackground: AppBackground,
    AppPopUp: AppPopUp,
    AppUserPopUp: AppUserPopUp
};

module.exports = models;