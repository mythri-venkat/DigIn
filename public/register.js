angular.module('app').controller('registerctrl', ['$scope','$location','shared', function($scope,$location,shared){
	
    $scope.user={
        firstname:"",
        lastname:"",
        role:"customer",
        email:"",
        password:"",
        username:"",
        restname:""
    };


    
    $scope.register = function(){
        
        console.log($scope.user);

        shared.register($scope.user).then(function(response){
            if(response.status =='200'){
                alert("Registration Successful,Proceed to login.");
                $location.path('/login');
            }
            else{
                alert(response.data);
            }

        });
       
    }
}])
