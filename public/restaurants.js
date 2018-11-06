angular.module('app')
.controller('restctrl',['$scope','$location','restaurant',function($scope,$location,restaurant){
    $scope.restaurants=[];
    

    $scope.$on('$routeChangeSuccess',function(){
        $scope.restaurants = restaurant.getAll();   
             
    })

    $scope.isvalid=function(idx){
        
        if(idx < $scope.restaurants.length){
            return true;
        }
        else{
            return false;
        }
    }

    $scope.menu=function(idx){
        $location.path('restaurants/'+$scope.restaurants[idx].id);
    }

}])