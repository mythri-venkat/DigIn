angular.module('app').controller('registerctrl', ['$scope','$location', function($scope,$location){
	$scope.username="";
    $scope.password="";
    $scope.firstname="";
    $scope.lastname="";
    $scope.restname=""
    $scope.type = 1
    $scope.register = function(){
        
        alert("Registration Successful,Proceed to login.");
        $location.path('/login');
    }
}]);
