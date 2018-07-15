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
        .state('pet', {
            url: '/pet?petGender&petSeries&vaccination&neuter&searchItem',
            views: {
                contents: {
                    templateUrl: templatePath + 'main/views/contents/pet.html'
                }
            }
        })
        .state('diary', {
            url: '/diary',
            views: {
                contents: {
                    templateUrl: templatePath + 'main/views/contents/diary.html'
                }
            }
        })
        .state('treatment', {
            url: '/treatment',
            views: {
                contents: {
                    templateUrl: templatePath + 'main/views/contents/treatment.html'
                }
            }
        });
}