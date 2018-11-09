angular.module('app')
    .controller('restctrl', ['$scope', '$location','$filter', 'restaurant', function ($scope, $location,$filter, restaurant) {
        $scope.restaurants = [];


        $scope.$on('$routeChangeSuccess', function () {
            restaurant.getAll().then(function (response) {
                $scope.restaurants = response;
                if (response == []) {
                    alert("No restaurants found");
                }
            });

        })

        $scope.isvalid = function (idx) {
            var ex =$filter('filter')([$scope.restaurants[idx]],$scope.searchRest);

            if (idx < $scope.restaurants.length && ex.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }

        $scope.ratingStr=function(stars) {
            var ratingStr = "";
            for (let i = 1; i <= 5; i++) {
                if (i<=stars) {
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