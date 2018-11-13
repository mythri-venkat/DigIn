angular.module('app')
    .controller('searchctrl', ['$scope', '$location', '$filter', 'restaurant', function ($scope, $location, $filter, restaurant) {
        $scope.restaurants = [];
       
        $scope.notfound = false;

        var showfew=true

        $scope.$on('$routeChangeSuccess', function () {
            $scope.getRestaurants("");           

        })

        $scope.getRestaurants = function(name){
            
            var callb;
            if(name != "" && name.length > 0){
                callb = restaurant.search(name);
            }
            else{
                callb = restaurant.getAll(0,3);
                showfew=true;
            }
        
            callb.then(function (data) {
                
                if (!data || data == []) {
                    $scope.notfound = true;
                }
                else {
                    //console.log()
                    
                    if(showfew){
                        $scope.restaurants = data.restaurants.slice(0,3);
                    }
                    else
                    $scope.restaurants = data.restaurants;

                    //console.log($scope.orders);
                    $scope.notfound = false;
                }
            });
        }


        $scope.isvalid = function (idx) {
            var ex = $filter('filter')([$scope.restaurants[idx]], $scope.searchRest);

            if (idx < $scope.restaurants.length && ex.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }

        $scope.searchitems = function(idx){
            
            if($scope.searchval && $scope.searchval!="" && $scope.searchval.length >0 ){
            
                var ex = $filter('filter')($scope.restaurants[idx].items, $scope.searchval);
                //console.log($scope.restaurants[idx]);
                var res = 'Dishes : ';
                for(var i=0;i<ex.length;i++){
                    res+=ex[i].name+",";
                }
                if( res.indexOf(",")<0)
                    return false;
                res = res.substr(0,res.length-1);
                //console.log(res);
                
                return res;
                
            }
            return false;           
            
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

        $scope.menu = function (idx) {
            $location.path('restaurants/' + idx);
        }

    }])