export default function navigator ($state, metaManager) {
    "ngInject";

    var COMMON = metaManager.std.common;

    var params = {
        // page: 1,
        // size: COMMON.defaultLoadingLength
    };

    this.setParams = setParams;

    this.goToIndex = goToIndex;
    this.goToLogin = goToLogin;
    this.goToSignUp = goToSignUp;
    this.goToFindPass = goToFindPass;
    this.goToPetManage = goToPetManage;
    this.goToPooManage = goToPooManage;
    this.goToMealManage = goToMealManage;
    this.goToTreatmentManage = goToTreatmentManage;
    this.goToChargeManage = goToChargeManage;
    this.goToReportManage = goToReportManage;
    this.goTo = goTo;

    function setParams (key, value) {
        params[key] = value;
    }

    function goTo (name, param, reload, callback) {
        if (!param) {
            param = params;
        }
        $state.go(name, param, {
            reload: reload
        }).then(function () {
            if (callback) {
                callback();
            }
        });
    }

    function goToIndex () {
        goTo("index");
    }

    function goToLogin () {
        goTo("login");
    }

    function goToSignUp () {
        goTo("signUp");
    }

    function goToFindPass () {
        goTo("findPass");
    }

    function goToPetManage () {
        goTo('petManage');
    }

    function goToPooManage () {
        goTo('pooManage');
    }

    function goToMealManage () {
        goTo('mealManage');
    }

    function goToTreatmentManage () {
        goTo('treatmentManage');
    }

    function goToChargeManage () {
        goTo('chargeManage');
    }

    function goToReportManage () {
        goTo('reportManage');
    }
}