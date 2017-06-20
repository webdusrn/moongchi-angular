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
}