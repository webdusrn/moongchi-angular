import './assets/stylesheets/main.scss';

// config
import config from './config/app.main.config';
import routing from './config/app.main.route';
import inputConfig from './config/app.main.input.config';
import textareaConfig from './config/app.main.textarea.config';

//controller
import MainCtrl from './controllers/app.main.controller';

import HeaderCtrl from './controllers/layouts/app.main.header.controller';
import FooterCtrl from './controllers/layouts/app.main.footer.controller';
import NavigationCtrl from './controllers/layouts/app.main.navigation.controller';

import IndexCtrl from './controllers/contents/app.main.index.controller';
import LoginCtrl from './controllers/contents/app.main.login.controller';
import SignUpCtrl from './controllers/contents/app.main.sign-up.controller';
import FindPassCtrl from './controllers/contents/app.main.find-pass.controller';
import PetCtrl from './controllers/contents/app.main.pet.controller';
import DiaryCtrl from './controllers/contents/app.main.diary.controller';
import TreatmentCtrl from './controllers/contents/app.main.treatment.controller';

import DetailPetCtrl from './controllers/modals/app.main.detail-pet.controller';
import DetailDiaryCtrl from './controllers/modals/app.main.detail-diary.controller';
import SelectPetCtrl from './controllers/modals/app.main.select-pet.controller';

// directive
import active from './directives/active/app.main.active';
import autoFocus from './directives/auto-focus/app.main.auto-focus';
import defaultImage from './directives/default-image/app.main.default-image';
import loading from './directives/loading/app.main.loading';
import contentTitle from './directives/content-title/app.main.content-title';
import selectBox from './directives/select-box/app.main.select-box';
import selectPet from './directives/select-pet/app.main.select-pet';
import searchInput from './directives/search-input/app.main.search-input';
import more from './directives/more/app.main.more';
import uploadImage from './directives/upload-image/app.main.upload-image';
import fileOver from './directives/file-over';

// constant
import appResources from './services/constants/app.main.resources';
import navigationConstant from './services/constants/app.main.navigation.constant';

// model
import Background from './services/models/app.main.background.model';
import Pet from './services/models/app.main.pet.model';
import Diary from './services/models/app.main.diary.model';
import TreatmentGroup from './services/models/app.main.treatment-group.model';
import Treatment from './services/models/app.main.treatment.model';
import PetImage from './services/models/app.main.pet-image.model';
import PetSeries from './services/models/app.main.pet-series.model';

// manager
import backgroundsManager from './services/managers/app.main.backgrounds.manager';
import petsManager from './services/managers/app.main.pets.manager';
import diariesManager from './services/managers/app.main.diaries.manager';
import treatmentsManager from './services/managers/app.main.treatments.manager';

// handler
import appNavigator from './services/handlers/app.main.navigator';
import statusHandler from './services/handlers/app.main.status.handler';
import modalHandler from './services/handlers/app.main.modal-handler';

// filter
import attachZero from './filters/app.main.attach-zero.filter';
import vaccination from './filters/app.main.vaccination.filter';
import neuter from './filters/app.main.neuter.filter';

const APP_NAME = "app.main";

angular.module(APP_NAME, ['app.main-core'])
    .config(config)
    .config(routing)
    .config(inputConfig)
    .config(textareaConfig)

    .controller("MainCtrl", MainCtrl)
    .controller("HeaderCtrl", HeaderCtrl)
    .controller("FooterCtrl", FooterCtrl)
    .controller("NavigationCtrl", NavigationCtrl)
    .controller("IndexCtrl", IndexCtrl)
    .controller("LoginCtrl", LoginCtrl)
    .controller("SignUpCtrl", SignUpCtrl)
    .controller("FindPassCtrl", FindPassCtrl)
    .controller("PetCtrl", PetCtrl)
    .controller("DiaryCtrl", DiaryCtrl)
    .controller("TreatmentCtrl", TreatmentCtrl)
    .controller("DetailPetCtrl", DetailPetCtrl)
    .controller("DetailDiaryCtrl", DetailDiaryCtrl)
    .controller("SelectPetCtrl", SelectPetCtrl)

    .directive("active", active)
    .directive("autoFocus", autoFocus)
    .directive("defaultImage", defaultImage)
    .directive("loading", loading)
    .directive("contentTitle", contentTitle)
    .directive("selectBox", selectBox)
    .directive("selectPet", selectPet)
    .directive("searchInput", searchInput)
    .directive("more", more)
    .directive("uploadImage", uploadImage)
    .directive("fileOver", fileOver)

    .constant("appResources", appResources)
    .constant("navigationConstant", navigationConstant)

    .factory("Background", Background)
    .factory("Pet", Pet)
    .factory("Diary", Diary)
    .factory("TreatmentGroup", TreatmentGroup)
    .factory("Treatment", Treatment)
    .factory("PetImage", PetImage)
    .factory("PetSeries", PetSeries)

    .service("backgroundsManager", backgroundsManager)
    .service("petsManager", petsManager)
    .service("diariesManager", diariesManager)
    .service("treatmentsManager", treatmentsManager)
    .service("appNavigator", appNavigator)
    .service("statusHandler", statusHandler)
    .service("modalHandler", modalHandler)

    .filter("attachZero", attachZero)
    .filter("neuter", neuter)
    .filter("vaccination", vaccination);

if (window.location.hash === '#_=_') window.location.hash = '/';

angular.element(document).ready(function () {
    angular.bootstrap(document, [APP_NAME]);
});

export default APP_NAME;