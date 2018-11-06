angular.module('app').controller('loginctrl', ['$scope','$location','$cookies','shared', function($scope,$location,$cookies,shared){
	$scope.username="";
    $scope.password="";
    $scope.login = function(){
        var usr = {username:$scope.username};
        $cookies.putObject('usr',usr);
        shared.login();
        alert("Login Successful");
        $location.path('/');
    }
}]);
