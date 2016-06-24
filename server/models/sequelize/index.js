
var path = require('path');
var fs = require('fs');
var sequelize = require('../../../../core/server/config/sequelize');
var Profile = require('./profile');

var models = {
    Profile: Profile
};

module.exports = models;