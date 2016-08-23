routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    $stateProvider.state('index', {
        url: '/',
        views: {
            'header': {
                templateUrl: 'pages/main/views/layouts/header.html'
            },
            'footer': {
                templateUrl: 'pages/main/views/layouts/footer.html'
            },
            'contents': {
                templateUrl: 'pages/main/views/layouts/main-contents.html'
            }
        }
    });
}
