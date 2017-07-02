import './assets/stylesheets/admin.scss';

import config from './config/app.admin.config';
import routing from './config/app.admin.route';
import inputConfig from './config/app.admin.input.config';
import textareaConfig from './config/app.admin.textarea.config';

import AdminCtrl from './controllers/app.admin.controller';
import LoginCtrl from './controllers/app.admin.login.controller';
import IndexCtrl from './controllers/app.admin.index.controller';

import appResources from './services/app.admin.constant';

import navigator from './services/app.admin.navigator';

const APP_NAME = "app.admin";

angular.module(APP_NAME, ['app.admin-core'])
    .config(config)
    .config(routing)
    .config(inputConfig)
    .config(textareaConfig)
    .controller("AdminCtrl", AdminCtrl)
    .controller("LoginCtrl", LoginCtrl)
    .controller("IndexCtrl", IndexCtrl)
    .constant("appResources", appResources)
    .service("navigator", navigator);

if (window.location.hash === '#_=_') window.location.hash = '/';

angular.element(document).ready(function () {
    angular.bootstrap(document, [APP_NAME]);
});

export default APP_NAME;