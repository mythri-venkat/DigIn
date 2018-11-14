angular.module('app')
    .controller('restdetailctrl', ['$scope', 'shared', 'restaurant','$location', 
    function ($scope , shared, restaurant,$location) {

        $scope.rest = {};
        $scope.rest_id;
        $scope.cust_id;
        $scope.$on('$routeChangeSuccess', function () {
            var usr = shared.getUser();
            $scope.rest_id = usr.rest_id;
            $scope.cust_id = usr.id;
            restaurant.getRestaurant(usr.rest_id).then(
                function(response){
                    if(response){
                        $scope.rest = response;
                    }
                    else{
                        alert("unable to retrieve data");
                    }
                }
            )
        })

        $scope.submit = function(){
            restaurant.editprofile($scope.rest_id,$scope.cust_id,$scope.rest).then(function(response){
                if(response){
                    alert("successfully edited");
                    
                }
                else{
                    alert("unable to retrieve data");
                }

            },function(){

            })
        }


    }])
