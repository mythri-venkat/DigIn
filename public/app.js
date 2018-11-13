angular.module('app', ['ngRoute', 'ngCookies','ngSanitize','ui.bootstrap.pagination'])
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
            .when('/cart',{
                templateUrl:'cart.html',
                controller:'cartctrl',
                caseInsensitiveMatch:true
            })
            .when('/manage',{
                templateUrl:'manage.html',
                controller:'managectrl',
                caseInsensitiveMatch:true                
            })
            .when('/orders',{
                templateUrl:'orders.html',
                controller:'ordersctrl',
                caseInsensitiveMatch:true
            })
            .when('/',{
                templateUrl:'search.html',
                controller:'searchctrl',
                caseInsensitiveMatch:true
            })
            .otherwise({
                redirectTo: '/'
            })
    }])
    .run(['$rootScope', '$location', '$cookies', function ($rootScope, $location, $cookies) {
        var usr = $cookies.getObject('usr');

        if (!usr){
            $location.path('/');

        }

    }])

    .controller('ctrl', ['$scope', '$cookies', '$location', '$rootScope', 'shared','cart', function ($scope, $cookies, $location, $rootScope, shared,cart) {

        var observelogin = function () {
            //console.log()
            $scope.loggedin = shared.isloggedIn();
            if($scope.loggedin){
                $scope.role = shared.getUser().role;
            }
            
            

        }

        $scope.itemCount = cart.itemCount;
        var observecart = function(){
            
            $scope.itemCount = cart.itemCount;
            console.log(cart.itemCount);
        }
        $scope.loggedin=false;
        $scope.role = 'customer';
        shared.registerobserver(observelogin);
        cart.registerobserver(observecart);
        $scope.init = function () {
            
            var usr = $cookies.getObject('usr');
            

            if (usr) {
                $scope.loggedin = true;
                $scope.role = usr.role;
                
            }
            else {
                $scope.loggedin = false;

            }
        }
        $scope.logout = function () {
            
            shared.logout();
            $scope.loggedin=false;
            cart.itemCount = 0;
            $location.path('/')
        }

    }])


