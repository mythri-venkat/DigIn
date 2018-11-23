angular.module('app').controller('userctrl', ['$scope', 'orderservice', 'shared', function ($scope, orderservice, shared) {
    $scope.users = [];
    $scope.notfound = false;
    $scope.showdetails = [];
    $scope.numPerPage = 10;
    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    
    $scope.$on('$routeChangeSuccess', function () {
        //console.log(shared.getUser().id);
        //console.log(user);
        $scope.getUsers();
        
    });

    $scope.getUsers = function(){
        if(shared.getUser().role == 'admin')
        shared.getAllUsers(shared.getUser().id,($scope.currentPage - 1) * $scope.numPerPage, $scope.numPerPage)
        .then(function(data){
            if (!data || data == []) {
                $scope.notfound = true;
            }
            else {
                // console.log(data.orders);
                // $scope.noOfPages = Math.ceil(data["count"]/$scope.numPerPage);
                // $scope.orders = data["orders"];
                $scope.noOfPages = Math.ceil(data.count/$scope.numPerPage);
                $scope.users = data.users;
                //console.log($scope.orders);
                $scope.notfound = false;
               
            }

        })      
    }

    $scope.deleteuser = function(idx){
        shared.deleteuser(shared.getUser().id,$scope.users[idx].id).then(function(response){
            if(response){
                $scope.users.splice(idx,1);
                alert("deleted successfully");
            }
            else{
                alert("could not delete");
            }
        })
    }

    $scope.$watch('currentPage',$scope.getUsers);

}]);
