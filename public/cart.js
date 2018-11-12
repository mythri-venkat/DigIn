angular.module('app')
    .controller('cartctrl', ['$scope', 'cart', 'shared', 'orderservice', function ($scope, cart, shared, orderservice) {

        $scope.deliveryaddr = "";
        $scope.cartItems = [];
        $scope.restaurant = {};
        $scope.custId = "";
        $scope.tax = 0;
        $scope.total = 0;
        $scope.finaltotal = 0;
        $scope.gettotal = function () {
            var total = 0;
            for (var i = 0; i < $scope.cartItems.length; i++) {
                total += $scope.cartItems[i].item.price * $scope.cartItems[i].quantity;
            }
            $scope.total = total;
            return total;
        }

        $scope.gettax = function () {
            var tax = $scope.restaurant.tax;
            if (tax) {

                $scope.tax = (tax * $scope.gettotal() / 100);
                $scope.finaltotal = $scope.tax + $scope.total;
                return $scope.tax;
            }
            else {
                return 0;
            }
        }

        $scope.isvalid = function () {
            if ($scope.cartItems.length > 0) {
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


            cart.getItems().then(function (response) {
                if (response) {
                    console.log(response);
                    $scope.cartItems = response;
                    $scope.restaurant = cart.getRestaurant();
                }
            });

            //console.log($scope.restaurant);

        }
        $scope.remove = function (id) {
            cart.removeItem(id, $scope.cartItems[id].id);
            $scope.cartItems.splice(id, 1);
        }

        $scope.makePayment = function () {

            $('#payModal').modal('show');
        }
        $scope.placeOrder = function () {

            $('#payModal').modal('hide');
            orderservice.placeOrder($scope.custId, $scope.restaurant.id, $scope.cartItems)

                .then(function (response) {
                    if (response) {
                        
                        $('#orderModal').modal('show');

                    }
                    else {
                        $('#orderModal').modal('show');
                        console.log("error");
                        //alert("Could not place order!");
                    }
                })
        }
    }])