export default function NavigationCtrl ($scope, appNavigator, navigationConstant) {
    'ngInject';
    var vm = $scope.vm;

    $scope.items = navigationConstant.items;
}