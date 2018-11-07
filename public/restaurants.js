angular.module('app')
.controller('restctrl',['$scope','$location','restaurant',function($scope,$location,restaurant){
    $scope.restaurants=[];
    

    $scope.$on('$routeChangeSuccess',function(){
       restaurant.getAll().then(function(response){
           $scope.restaurants = response;
           if(response==[]){
               alert("No restaurants found");
           }
       });   
             
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
        $location.path('restaurants/'+idx);
    }

}])