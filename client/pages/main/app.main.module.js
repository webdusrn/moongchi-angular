
import config from './config/app.main.config';
import routing from './config/app.main.route';
import inputConfig from './config/app.main.input.config';
import textareaConfig from './config/app.main.textarea.config';

import MainCtrl from './controllers/app.main.controller';
import HeaderCtrl from './controllers/app.main.header.controller';
import FooterCtrl from './controllers/app.main.footer.controller';
import LoginCtrl from './controllers/app.main.login.controller';
import SignUpCtrl from './controllers/app.main.sign-up.controller';

const APP_NAME = "app.main";

angular.module(APP_NAME, ['app.main-core'])
    .config(config)
    .config(routing)
    .config(inputConfig)
    .config(textareaConfig)
    .controller("MainCtrl", MainCtrl)
    .controller("HeaderCtrl", HeaderCtrl)
    .controller("FooterCtrl", FooterCtrl)
    .controller("LoginCtrl", LoginCtrl)
    .controller("SignUpCtrl", SignUpCtrl);

if (window.location.hash === '#_=_') window.location.hash = '/';

angular.element(document).ready(function () {
    angular.bootstrap(document, [APP_NAME]);
});

export default APP_NAME;