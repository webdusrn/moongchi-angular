module.exports = function(app) {
    require('./main')(app);
    require('./admin')(app);
};