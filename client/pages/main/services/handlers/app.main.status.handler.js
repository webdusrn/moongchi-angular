export default function statusHandler (appNavigator, dialogHandler) {
    "ngInject";
    var vm = null;

    this.init = init;
    this.active = active;

    function init (scopeVm) {
        vm = scopeVm;
    }

    function active (data, callback) {
        if (data.status == 401) {
            appNavigator.goToLogin();
            vm.session = {};
        }
        callback(data.status, data.data);
    }
}