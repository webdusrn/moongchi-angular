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
import PetManageCtrl from './controllers/app.main.pet-manage.controller';
import AddPetCtrl from './controllers/app.main.add-pet.controller';
import DetailPetCtrl from './controllers/app.main.detail-pet.controller';
import TreatmentManageCtrl from './controllers/app.main.treatment-manage.controller';
import MealManageCtrl from './controllers/app.main.meal-manage.controller';
import ChargeManageCtrl from './controllers/app.main.charge-manage.controller';
import PooManageCtrl from './controllers/app.main.poo-manage.controller';
import DetailPooCtrl from './controllers/app.main.detail-poo.controller';
import ReportManageCtrl from './controllers/app.main.report-manage.controller';
import AddReportCtrl from './controllers/app.main.add-report.controller';
import DetailReportCtrl from './controllers/app.main.detail-report.controller';

import active from './directives/active/app.main.active';
import autoFocus from './directives/auto-focus/app.main.auto-focus';
import defaultImage from './directives/default-image/app.main.default-image';
import loading from './directives/loading/app.main.loading';
import popUp from './directives/pop-up/app.main.pop-up';
import pooInfo from './directives/poo-info/app.main.poo-info';

import appResources from './services/app.main.constant';

import Background from './services/app.main.background.model';
import Pet from './services/app.main.pet.model';
import Poo from './services/app.main.poo.model';
import PetPoo from './services/app.main.pet-poo.model';
import Report from './services/app.main.report.model';
import PopUp from './services/app.main.pop-up.model';

import backgroundsManager from './services/app.main.backgrounds.manager';
import petsManager from './services/app.main.pets.manager';
import poosManager from './services/app.main.poos.manager';
import reportsManager from './services/app.main.reports.manager';
import popUpsManager from './services/app.main.pop-ups.manager';

import navigator from './services/app.main.navigator';
import modalHandler from './services/app.main.modal.handler';
import statusHandler from './services/app.main.status.handler';

import vaccination from './filters/app.main.vaccination.filter';
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
    .controller("PetManageCtrl", PetManageCtrl)
    .controller("AddPetCtrl", AddPetCtrl)
    .controller("DetailPetCtrl", DetailPetCtrl)
    .controller("TreatmentManageCtrl", TreatmentManageCtrl)
    .controller("MealManageCtrl", MealManageCtrl)
    .controller("ChargeManageCtrl", ChargeManageCtrl)
    .controller("PooManageCtrl", PooManageCtrl)
    .controller("DetailPooCtrl", DetailPooCtrl)
    .controller("ReportManageCtrl", ReportManageCtrl)
    .controller("AddReportCtrl", AddReportCtrl)
    .controller("DetailReportCtrl", DetailReportCtrl)
    .directive("active", active)
    .directive("autoFocus", autoFocus)
    .directive("defaultImage", defaultImage)
    .directive("loading", loading)
    .directive("popUp", popUp)
    .directive("pooInfo", pooInfo)
    .constant("appResources", appResources)
    .factory("Background", Background)
    .factory("Pet", Pet)
    .factory("Poo", Poo)
    .factory("PetPoo", PetPoo)
    .factory("Report", Report)
    .factory("PopUp", PopUp)
    .service("backgroundsManager", backgroundsManager)
    .service("petsManager", petsManager)
    .service("poosManager", poosManager)
    .service("reportsManager", reportsManager)
    .service("popUpsManager", popUpsManager)
    .service("navigator", navigator)
    .service("modalHandler", modalHandler)
    .service("statusHandler", statusHandler)
    .filter("vaccination", vaccination)
    .filter("attachZero", attachZero);

if (window.location.hash === '#_=_') window.location.hash = '/';

angular.element(document).ready(function () {
    angular.bootstrap(document, [APP_NAME]);
});

export default APP_NAME;