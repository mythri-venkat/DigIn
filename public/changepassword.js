angular.module('app').controller('changepwdctrl', ['$scope', '$location', '$cookies', 'shared',
 function ($scope, $location, $cookies, shared) {
     $scope.pass = {
         curr:'',
         new:'',
         confirm:''
     }
     $scope.success=true;
     $scope.verify = function(){
         return $scope.pass.confirm != $scope.pass.new
     }
     $scope.submit = function(){
         
         shared.changepassword(shared.getUser().id,$scope.pass).then(function(response){
             if(response){
                 alert("successfully changed password");
                 $location.path('/');
             }
         },function(error){
             alert("Unable to connect to server");
         })
     }

}])