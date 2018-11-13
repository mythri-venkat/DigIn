angular.module('app').controller('managectrl', ['$scope', 'orderservice', 'shared', function ($scope, orderservice, shared) {
    $scope.orders = [];
    $scope.notfound = false;
    $scope.showdetails = [];
    $scope.numPerPage = 10;
    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    $scope.orderFilter='order.date';
    $scope.Filter = {}
    $scope.Filter.status = '';
    $scope.statusEnum = { 1:"Order Placed",2:"Processing",3:"Delivered",4:"Cancelled"};
    $scope.orderCount = 0;
    $scope.$on('$routeChangeSuccess', function () {
        //console.log(shared.getUser().id);
        //console.log(user);
        $scope.getOrders();
       
    });

    $scope.getOrders = function(){
        orderservice.getRestaurantOrders(shared.getUser().restId,($scope.currentPage - 1) * $scope.numPerPage, $scope.numPerPage)
        .then(function(data){
            if (!data || data == []) {
                $scope.notfound = true;
            }
            else {
                //console.log()
                // $scope.noOfPages = Math.ceil(data["count"]/$scope.numPerPage);
                // $scope.orders = data["orders"];
                $scope.orderCount = data.count;
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

    $scope.changeStatus = function(idx,stat){
        
        orderservice.changeStatus($scope.orders[idx].id, stat).then(function(response){
            if(response){
                $scope.orders[idx].status = stat;
            }
            else{
                alert("order status could not be changed");

            }
                        
        },function(error){
            alert("order status could not be changed");

        })
    }

    $scope.getRevenue = function(){
        return orderservice.revenue();
    }

    $scope.show = function (idx) {
        var b = $scope.showdetails[idx];
        for (var i = 0; i < $scope.orders.length; i++) {
            $scope.showdetails[i] = (false);
        }
        $scope.showdetails[idx] = !b;
    }
}]);
