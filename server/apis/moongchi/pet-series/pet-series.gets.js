var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

gets.validate = function(){
    return function(req, res, next){

        req.utils.common.checkError(req, res, next);
    };
};

gets.setParam = function() {
    return function(req, res, next) {
        req.models.AppPet.findPetSeriesByUser(req.user, function (status, data) {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

gets.supplement = function(){
    return function(req, res, next){
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = gets;
