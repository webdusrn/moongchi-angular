var express = require('express');

module.exports = function (app) {

    app.use(function (req, res, next) {
        req.appUtils = require('../utils');
        next();
    });

    return app;
};