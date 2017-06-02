
import config from './config/app.main.config';
import routing from './config/app.main.route';

import MainCtrl from './controllers/app.main.controller';

const APP_NAME = "app.main";

angular.module(APP_NAME, ['app.main-core'])
    .config(config)
    .config(routing)
    .controller("MainCtrl", MainCtrl);

if (window.location.hash === '#_=_') window.location.hash = '/';

angular.element(document).ready(function () {
    angular.bootstrap(document, [APP_NAME]);
});

export default APP_NAME;