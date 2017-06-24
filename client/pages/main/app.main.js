import './assets/stylesheets/main.scss';

import config from './config/app.main.config';
import routing from './config/app.main.route';
import inputConfig from './config/app.main.input.config';
import textareaConfig from './config/app.main.textarea.config';

import MainCtrl from './controllers/app.main.controller';
import HeaderCtrl from './controllers/app.main.header.controller';
import FooterCtrl from './controllers/app.main.footer.controller';
import IndexCtrl from './controllers/app.main.index.controller';
import LoginCtrl from './controllers/app.main.login.controller';
import SignUpCtrl from './controllers/app.main.sign-up.controller';

import navigator from './services/app.main.navigator';
import modalHandler from './services/app.main.modal.handler';
import statusHandler from './services/app.main.status.handler';

const APP_NAME = "app.main";

angular.module(APP_NAME, ['app.main-core'])
    .config(config)
    .config(routing)
    .config(inputConfig)
    .config(textareaConfig)
    .controller("MainCtrl", MainCtrl)
    .controller("HeaderCtrl", HeaderCtrl)
    .controller("FooterCtrl", FooterCtrl)
    .controller("IndexCtrl", IndexCtrl)
    .controller("LoginCtrl", LoginCtrl)
    .controller("SignUpCtrl", SignUpCtrl)
    .service("navigator", navigator)
    .service("modalHandler", modalHandler)
    .service("statusHandler", statusHandler);

if (window.location.hash === '#_=_') window.location.hash = '/';

angular.element(document).ready(function () {
    angular.bootstrap(document, [APP_NAME]);
});

export default APP_NAME;