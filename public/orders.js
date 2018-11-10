angular.module('app').controller('ordersctrl', ['$scope', 'orderservice', 'shared', function ($scope, orderservice, shared) {
    $scope.orders = [];
    $scope.notfound = false;
    $scope.showdetails = [];
    $scope.numPerPage = 10;
    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    
    $scope.$on('$routeChangeSuccess', function () {
        //console.log(shared.getUser().id);
        //console.log(user);
        $scope.getOrders();
        
    });

    $scope.getOrders = function(){
        orderservice.getCustomerOrders(shared.getUser().id,($scope.currentPage - 1) * $scope.numPerPage, $scope.numPerPage)
        .then(function(data){
            if (!data || data == []) {
                $scope.notfound = true;
            }
            else {
                //console.log()
                // $scope.noOfPages = Math.ceil(data["count"]/$scope.numPerPage);
                // $scope.orders = data["orders"];
                $scope.noOfPages = Math.ceil(data.count/$scope.numPerPage);
                $scope.orders = data.orders;
                //console.log($scope.orders);
                $scope.notfound = false;
                $scope.showdetails=[];
                for (var i = 0; i < $scope.orders.length; i++) {
                    $scope.showdetails.push(false);
                }
            }

        })

        
        
    }

    $scope.$watch('currentPage',$scope.getOrders);



    $scope.show = function (idx) {
        var b = $scope.showdetails[idx];
        for (var i = 0; i < $scope.orders.length; i++) {
            $scope.showdetails[i] = (false);
        }
        $scope.showdetails[idx] = !b;
    }
}]);
