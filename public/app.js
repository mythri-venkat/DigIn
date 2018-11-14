angular.module('app', ['ngRoute', 'ngCookies', 'ngSanitize', 'ui.bootstrap.pagination'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'login.html',
                controller: 'loginctrl',
                caseInsensitiveMatch: true
            })
            .when('/register', {
                templateUrl: 'register.html',
                controller: 'registerctrl',
                caseInsensitiveMatch: true
            })
            .when('/restaurants', {
                templateUrl: 'restaurants.html',
                controller: 'restctrl',
                caseInsensitiveMatch: true
            })
            .when('/restaurants/:id', {
                templateUrl: 'menu.html',
                controller: 'menuctrl',
                caseInsensitiveMatch: true

            })
            .when('/cart', {
                templateUrl: 'cart.html',
                controller: 'cartctrl',
                caseInsensitiveMatch: true
            })
            .when('/manage', {
                templateUrl: 'manage.html',
                controller: 'managectrl',
                caseInsensitiveMatch: true
            })
            .when('/orders', {
                templateUrl: 'orders.html',
                controller: 'ordersctrl',
                caseInsensitiveMatch: true
            })
            .when('/', {
                templateUrl: 'search.html',
                controller: 'searchctrl',
                caseInsensitiveMatch: true
            })
            .when('/search', {
                templateUrl: 'search.html',
                controller: 'searchctrl',
                caseInsensitiveMatch: true
            })
            .when('', {
                redirectTo: '/search'
            })
            .when('/editProfile', {
                templateUrl: 'restaurantdetail.html',
                controller: 'restdetailctrl',
                caseInsensitiveMatch: true
            })
            .when('/menuitem', {
                templateUrl: 'menu_item.html',
                controller: 'menuitemctrl',
                caseInsensitiveMatch: true
            })
            .when('/changePassword', {
                templateUrl: 'changepassword.html',
                controller: 'changepwdctrl',
                caseInsensitiveMatch: true
            })
            .when('/users',{
                templateUrl:'adminusers.html',
                controller:'userctrl',
                caseInsensitiveMatch:true
            })
            .when('/adminorders',{
                templateUrl:'adminorders.html',
                controller:'adminorderctrl',
                caseInsensitiveMatch:true
            })
            .otherwise({
                redirectTo: '/search'
            })
    }])
    .run(['$rootScope', '$location', '$cookies', '$routeParams', function ($rootScope, $location, $cookies, $routeParams) {
        var usr = $cookies.getObject('usr');

        if (!usr) {
            var arr = { '/cart': "1", "/manage": 2, "/orders": 3 }
            console.log(arr[$location.path()]);
            if (arr[$location.path()] != undefined)
                $location.path('/');

        }

    }])

    .controller('ctrl', ['$scope', '$cookies', '$location', '$rootScope', 'shared', 'cart','orderservice', function ($scope, $cookies, $location, $rootScope, shared, cart,orderservice) {

        var observelogin = function () {
            //console.log()
            $scope.loggedin = shared.isloggedIn();
            if ($scope.loggedin) {
                $scope.role = shared.getUser().role;
            }



        }

        // $scope.neworder = false;
        // $scope.ordercount=0;
        $scope.msgcount =0;
        $scope.messages=[];
        var observeorder = function(){
            if(orderservice.messages.length > $scope.msgcount){

                // $scope.neworder = true;
                for(var i=$scope.msgcount;i<orderservice.messages.length;i++){
                    $scope.messages.push(orderservice.messages[i]);
                }
                $scope.msgcount = $scope.messages.length;
            }
        }

        $scope.markread = function(){

            orderservice.markread(shared.getUser().id).then(function(response){
                if(response){
                    $scope.messages=[];
                    $scope.msgcount =0;
                }
            })
        }

        $scope.itemCount = cart.itemCount;
        var observecart = function () {

            $scope.itemCount = cart.itemCount;
            console.log(cart.itemCount);
        }
        $scope.loggedin = false;
        $scope.role = 'customer';
        shared.registerobserver(observelogin);
        cart.registerobserver(observecart);
        orderservice.registerobserverlen(observeorder);
        $scope.isActive = function (viewLocation) { 
            return viewLocation === $location.path();
        };
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
        // = ['order placed adljfd','adfakdjflaf'];
        $scope.logout = function () {

            shared.logout(shared.getUser()).then(function (response) {
                if (response) {
                    $scope.loggedin = false;
                    orderservice.stoptimer();
                    $location.path('/')
                }
                else{
                    alert("unable to log out");
                }
            });

        }

    }])


