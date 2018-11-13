angular.module('app')
    .controller('cartctrl', ['$scope', 'cart', 'shared', 'orderservice', function ($scope, cart, shared, orderservice) {

        $scope.deliveryaddr = "";
        $scope.cartItems = {};
        $scope.restaurant = {};
        $scope.custId = "";
        $scope.tax = 5;
        $scope.total = 0;
        $scope.finaltotal = 0;
        $scope.orderId = "";
        $scope.gettotal = function () {
            $scope.total = 0;
            angular.forEach($scope.cartItems,function(value,key){
                //console.log(key);
                $scope.total+=value.item.price*value.quantity; 
            })
            // for (var i = 0; i < $scope.cartItems.length; i++) {
            //     if($scope.cartItems[i].item != undefined)
            //     total += $scope.cartItems[i].item.price * $scope.cartItems[i].quantity;
            // }
            //$scope.total = total;
            return $scope.total;
        }

        $scope.gettax = function () {
            var tax = $scope.restaurant.tax;
            if (tax) {

                $scope.tax = (tax * $scope.gettotal() / 100);
                $scope.finaltotal = $scope.tax + $scope.total;
                return $scope.tax;
            }
            else {
                $scope.finaltotal = $scope.total;
                return 0;
            }
        }

        $scope.isvalid = function () {
            if (cart.itemCount > 0) {
                return true;
            }
            else {
                return false;
            }
        }
    

        $scope.$on('$routeChangeSuccess', function () {
            $scope.onload();
        })
        $scope.onload = function () {
            $scope.deliveryaddr = shared.getUser().address;
            $scope.custId = shared.getUser().id;
            console.log(cart.itemCount);
            if (cart.itemCount == 0) {
                cart.getItems($scope.custId).then(function (response) {
                    if (response) {
                        console.log(response);
                        $scope.cartItems = response;
                        $scope.restaurant = cart.getRestaurant();
                    }
                });
            }
            else{
                $scope.cartItems = cart.getCartItems();
                
                $scope.restaurant = cart.getRestaurant();
            }

            //console.log($scope.restaurant);

        }
        $scope.remove = function (id) {
            
            cart.removeItem(shared.getUser().id,id);
            delete $scope.cartItems[id];
        }

        $scope.makePayment = function () {

            $('#payModal').modal('show');
        }
        $scope.placeOrder = function () {

            $('#payModal').modal('hide');
            orderservice.placeOrder($scope.custId, $scope.restaurant.id, $scope.cartItems)

                .then(function (response) {
                    console.log(response);
                    if (response) {
                        
                        $scope.orderId = response;
                        $('#orderModal').modal('show');

                    }
                    else {
                       
                        alert("Order could not be placed!");
                        
                        //alert("Could not place order!");
                    }
                },function(error){
                    alert("Order could not be placed!");
                    console.log(error);
                })
        }
    }])