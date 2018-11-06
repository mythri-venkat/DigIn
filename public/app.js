angular.module('app', ['ngRoute', 'ngCookies'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'login.html',
                controller: 'loginctrl',
                caseInsensitiveMatch: true 
            })
            .when('/register',{
                templateUrl:'register.html',
                controller:'registerctrl',
                caseInsensitiveMatch:true
            })
            .when('/restaurants',{
                templateUrl:'restaurants.html',
                controller:'restctrl',
                caseInsensitiveMatch:true
            })
            .when('/restaurants/:id',{
                templateUrl:'menu.html',
                controller:'menuctrl',
                caseInsensitiveMatch:true
                
            })
            .otherwise({
                redirectTo: '/'
            })
    }])
    .run(['$rootScope', '$location', '$cookies', function ($rootScope, $location, $cookies) {
        var usr = $cookies.getObject('usr');

        if (!usr){
            $location.path('/restaurants');

        }

    }])

    .controller('ctrl', ['$scope', '$cookies', '$location', '$rootScope', 'shared', function ($scope, $cookies, $location, $rootScope, shared) {

        var observelogin = function () {
            $scope.loggedin = shared.isloggedIn();

        }
        shared.registerobserver(observelogin);
        $scope.init = function () {
            
            var usr = $cookies.getObject('usr');

            if (usr) {
                $scope.loggedin = true;
                
            }
            else {
                $scope.loggedin = false;

            }
        }
        $scope.logout = function () {
            $cookies.remove('usr');
            shared.logout();
            $location.path('/')
        }
    }])


