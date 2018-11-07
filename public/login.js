angular.module('app').controller('loginctrl', ['$scope','$location','$cookies','shared', function($scope,$location,$cookies,shared){
	$scope.username="";
    $scope.password="";
    $scope.login = function(){
        var usr = {username:$scope.username};
        
        shared.login(usr);
        alert("Login Successful");
        $location.path('/');
    }
}]);
