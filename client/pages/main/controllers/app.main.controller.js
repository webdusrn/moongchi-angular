MainCtrl.$inject = ['$scope', '$translate', '$location'];

class Hwarang {
    constructor(age) {
        this.age = age;
    }
    log() {
        console.log(this.age);
    }
}
export default function MainCtrl($scope, $location) {
    // staticLoader.get('route1.json', function (status, data) {
    //     $scope.contents = data;
    // });
    let hwarang = new Hwarang(30);
    hwarang.log();
}
