export default function attachZero () {
    'ngInject';

    return function (data) {
        if (data !== undefined) {
            if (data < 10) {
                return '0' + data;
            } else {
                return data;
            }
        } else {
            return null;
        }
    }
}