angular.module('app').controller('ordersctrl', ['$scope', 'orderservice', 'shared', function ($scope, orderservice, shared) {
    $scope.orders = [];
    $scope.notfound = false;
    $scope.showdetails = [];
    $scope.numPerPage = 10;
    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    $scope.statusEnum = { 1: "Order Placed", 2: "Processing", 3: "Delivered", 4: "Cancelled" };
    $scope.$on('$routeChangeSuccess', function () {
        //console.log(shared.getUser().id);
        //console.log(user);
        $scope.getOrders();

    });

    $scope.getOrders = function () {
        if (shared.getUser().role == 'customer')
            orderservice.getCustomerOrders(shared.getUser().id, ($scope.currentPage - 1) * $scope.numPerPage, $scope.numPerPage)
                .then(function (data) {
                    if (!data || data == []) {
                        $scope.notfound = true;
                    }
                    else {
                        console.log(data.orders);
                        // $scope.noOfPages = Math.ceil(data["count"]/$scope.numPerPage);
                        // $scope.orders = data["orders"];
                        $scope.noOfPages = Math.ceil(data.count / $scope.numPerPage);
                        $scope.orders = data.orders;
                        //console.log($scope.orders);
                        $scope.notfound = false;
                        $scope.showdetails = [];
                        for (var i = 0; i < $scope.orders.length; i++) {
                            $scope.showdetails.push(false);
                            // $scope.orders[i].rating = 0;
                            $scope.orders[i].orderstatus = $scope.statusEnum[$scope.orders[i].orderstatus];
                        }
                    }

                })

    }

    $scope.ratingarr = [1, 2, 3, 4, 5];

    $scope.$watch('currentPage', $scope.getOrders);

    $scope.rateorder = function ($event, idx, rating) {
        if ($scope.orders[idx].orderstatus == 'Delivered') {


            orderservice.rateorder(shared.getUser().id, $scope.orders[idx].order_id, $scope.orders[idx].restaurant.rest_id, rating).then(function (response) {
                if (response) {
                    $scope.orders[idx].rating = rating;
                }
            })
        }
        $event.stopPropagation();
        $event.preventDefault();

    }

    $scope.show = function (idx) {
        var b = $scope.showdetails[idx];
        for (var i = 0; i < $scope.orders.length; i++) {
            $scope.showdetails[i] = (false);
        }
        $scope.showdetails[idx] = !b;
    }
}]);
