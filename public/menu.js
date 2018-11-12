angular.module('app')
    .controller('menuctrl', ['$scope', '$routeParams', '$location', 'restaurant', 'cart','shared',
        function ($scope, $routeParams, $location, restaurant, cart,shared) {
            $scope.restaurant = {};
            $scope.quantity = [];

            var observelogin = function () {
                $scope.loggedin = shared.isloggedIn();
            }
            shared.registerobserver(observelogin);
            $scope.$on('$routeChangeSuccess', function () {
                observelogin();
                $scope.restaurant = restaurant.getRestaurant($routeParams.id);
                for (var i = 0; i < $scope.restaurant.items.length; i++) {
                    $scope.quantity.push(1);
                }
            })
            $scope.isvalid = function (idx) {

                if (idx < $scope.restaurant.items.length) {
                    return true;
                }
                else {
                    return false;
                }
            }
            $scope.add = function (idx) {
                cart.addItem(idx,$scope.restaurant,shared.getUser().id,$scope.restaurant.items[idx],$scope.quantity[idx]);
                $scope.quantity[idx]=1;
            }
            $scope.remove = function(idx){
                cart.removeItem(shared.getUser().id,$scope.restaurant.items[idx].item_id);
            }
        }])