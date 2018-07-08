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
import FindPassCtrl from './controllers/app.main.find-pass.controller';
import NavigationCtrl from './controllers/app.main.navigation.controller';
import ReportManageCtrl from './controllers/app.main.report-manage.controller';
import AddReportCtrl from './controllers/app.main.add-report.controller';
import DetailReportCtrl from './controllers/app.main.detail-report.controller';

import active from './directives/active/app.main.active';
import autoFocus from './directives/auto-focus/app.main.auto-focus';
import defaultImage from './directives/default-image/app.main.default-image';
import loading from './directives/loading/app.main.loading';
import popUp from './directives/pop-up/app.main.pop-up';

import appResources from './services/app.main.constant';

import Background from './services/app.main.background.model';
import Report from './services/app.main.report.model';
import PopUp from './services/app.main.pop-up.model';

import backgroundsManager from './services/app.main.backgrounds.manager';
import reportsManager from './services/app.main.reports.manager';
import popUpsManager from './services/app.main.pop-ups.manager';

import navigator from './services/app.main.navigator';
import modalHandler from './services/app.main.modal.handler';
import statusHandler from './services/app.main.status.handler';

import attachZero from './filters/app.main.attach-zero.filter';

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
    .controller("FindPassCtrl", FindPassCtrl)
    .controller("NavigationCtrl", NavigationCtrl)
    .controller("ReportManageCtrl", ReportManageCtrl)
    .controller("AddReportCtrl", AddReportCtrl)
    .controller("DetailReportCtrl", DetailReportCtrl)
    .directive("active", active)
    .directive("autoFocus", autoFocus)
    .directive("defaultImage", defaultImage)
    .directive("loading", loading)
    .directive("popUp", popUp)
    .constant("appResources", appResources)
    .factory("Background", Background)
    .factory("Report", Report)
    .factory("PopUp", PopUp)
    .service("backgroundsManager", backgroundsManager)
    .service("reportsManager", reportsManager)
    .service("popUpsManager", popUpsManager)
    .service("navigator", navigator)
    .service("modalHandler", modalHandler)
    .service("statusHandler", statusHandler)
    .filter("attachZero", attachZero);

if (window.location.hash === '#_=_') window.location.hash = '/';

angular.element(document).ready(function () {
    angular.bootstrap(document, [APP_NAME]);
});

export default APP_NAME;