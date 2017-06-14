routes.$inject = ['$stateProvider', '$urlRouterProvider'];

export default function routes($stateProvider, $urlRouterProvider) {
    var templatePath = window.meta.std.templatePath;

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('index', {
            url: '/',
            views: {
                contents: {
                    templateUrl: templatePath + 'main/views/contents/index.html'
                }
            }
        })
        .state('login', {
            url: '/login',
            views: {
                contents: {
                    templateUrl: templatePath + 'main/views/contents/login.html'
                }
            }
        })
        .state('signUp', {
            url: '/sign-up',
            views: {
                contents: {
                    templateUrl: templatePath + 'main/views/contents/sign-up.html'
                }
            }
        });
}