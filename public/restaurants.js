angular.module('app')
    .controller('restctrl', ['$scope', '$location', '$filter', 'restaurant','shared', function ($scope, $location, $filter, restaurant,shared) {
        $scope.restaurants = [];
        $scope.numPerPage = 9;
        $scope.noOfPages = 1;
        $scope.currentPage = 1;
        $scope.notfound = false;
        $scope.showdelete = false;
        

        $scope.$on('$routeChangeSuccess', function () {
            getRestaurants();    
            
        })

        function getRestaurants(){
            if(shared.isloggedIn() && shared.getUser().role == 'admin'){
                $scope.showdelete=true;
            }       

            restaurant.getAll(($scope.currentPage - 1) * $scope.numPerPage, $scope.numPerPage)
            .then(function (data) {
                
                if (!data || data == []) {
                    $scope.notfound = true;
                }
                else {
                    //console.log()
                    // $scope.noOfPages = Math.ceil(data["count"]/$scope.numPerPage);
                    // $scope.orders = data["orders"];
                    $scope.noOfPages = Math.ceil(data.count/$scope.numPerPage);
                    $scope.restaurants = data.restaurants;
                    //console.log($scope.orders);
                    $scope.notfound = false;
                }
            });
        }

        $scope.$watch('currentPage',getRestaurants);

        $scope.isvalid = function (idx) {
            var ex = $filter('filter')([$scope.restaurants[idx]], $scope.searchRest);

            if (idx < $scope.restaurants.length && ex.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }

        $scope.ratingStr = function (stars) {
            var ratingStr = "";
            for (let i = 1; i <= 5; i++) {
                if (i <= stars) {
                    ratingStr += '<span class="fa fa-star checked"></span>';
                }
                else {
                    ratingStr += '<span class="fa fa-star unchecked"></span>';
                }
            }

            return ratingStr;
        }

        $scope.deleterest = function($event,idx){
            restaurant.delete(shared.getUser().id,$scope.restaurants[idx].rest_id).then(function(response){
                if(response){
                    alert("deleted successfully");
                    $scope.restaurants.splice(idx,1);
                }
                else{
                    alert("could not delete");
                }
            });
            $event.stopPropagation();
            $event.preventDefault();
        }

        $scope.menu = function (idx) {
            $location.path('restaurants/' + $scope.restaurants[idx].rest_id);
        }

    }])