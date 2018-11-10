angular.module('app')
.controller('cartctrl', ['$scope', 'cart', 'shared', function ($scope, cart, shared) {
    $scope.cartItems = {};
    $scope.restaurant ={};
    $scope.deliveryaddr="";
    $scope.cartItems ={};
    $scope.restaurant = {};
    
    $scope.$on('$routeChangeSuccess',function(){
        $scope.onload();
    })
    $scope.onload = function(){
        $scope.cartItems = cart.getItems();
        $scope.restaurant = cart.getRestaurant();
        //console.log($scope.restaurant);
        $scope.deliveryaddr = shared.getUser().address;
    }
    $scope.remove = function(id){
        cart.removeItem(id);
        delete $scope.cartItems[id];
    }
    $scope.placeOrder = function(){
        
    }
}])