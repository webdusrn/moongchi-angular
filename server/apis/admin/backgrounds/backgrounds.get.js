var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();
        req.utils.common.checkError(req, res, next);
    };
};

get.setParam = function () {
    return function (req, res, next) {
        var include = req.models.AppBackground.getIncludeBackground();
        req.models.AppBackground.findDataIncludingById(req.params.id, include, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

get.supplement = function () {
    return function (req, res, next) {
        delete req.data.dataValues.userPets;
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = get;
