var path = require('path');
var routeHelper = require('sg-route-helper');
var express = require('express');

var META = require('../../bridge/metadata');

module.exports = function (app) {

    var adminRouter = express.Router();
    app.use('/', adminRouter);

    function pageRenderer() {
        return function(req, res, next) {
            var fileName = path.basename(__filename).split('.')[0];
            if (req.renderPage == fileName) {
                res.render('admin-' + process.env.NODE_ENV, req.preparedParam);
            } else {
                next();
            }
        };
    }

    adminRouter.get('/*',
        routeHelper.prepareParam("admin"),
        pageRenderer()
    );

    adminRouter.get('/',
        routeHelper.prepareParam("admin"),
        pageRenderer()
    );
};