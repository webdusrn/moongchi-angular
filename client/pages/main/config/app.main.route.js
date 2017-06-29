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
        })
        .state('findPass', {
            url: '/find-pass',
            views: {
                contents: {
                    templateUrl: templatePath + 'main/views/contents/find-pass.html'
                }
            }
        })
        .state('petManage', {
            url: '/pet-manage',
            views: {
                contents: {
                    templateUrl: templatePath + 'main/views/contents/pet-manage.html'
                }
            }
        })
        .state('treatmentManage', {
            url: '/treatment-manage',
            views: {
                contents: {
                    templateUrl: templatePath + 'main/views/contents/treatment-manage.html'
                }
            }
        })
        .state('mealManage', {
            url: '/meal-manage',
            views: {
                contents: {
                    templateUrl: templatePath + 'main/views/contents/meal-manage.html'
                }
            }
        })
        .state('chargeManage', {
            url: '/charge-manage',
            views: {
                contents: {
                    templateUrl: templatePath + 'main/views/contents/charge-manage.html'
                }
            }
        })
        .state('pooManage', {
            url: '/poo-manage',
            views: {
                contents: {
                    templateUrl: templatePath + 'main/views/contents/poo-manage.html'
                }
            }
        });
}