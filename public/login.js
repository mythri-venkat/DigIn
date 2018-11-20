angular.module('app').controller('loginctrl', ['$scope', '$location', '$cookies', 'shared','orderservice', function ($scope, $location, $cookies, shared,orderservice) {
    $scope.username = "";
    $scope.password = "";
    $scope.loginfail=false;
    
    $scope.login = function () {
        var usr = { username: $scope.username, password: $scope.password };

        shared.login(usr).then(function (response) {
            if (response) {
                alert("Login Successful");
                console.log(response);
                $scope.loginfail=false;
                if(response.role == 'customer'){
                    $location.path('/restaurants');
                }
                else if(response.role == 'restaurant'){
                    if(response.rest_id != undefined)
                        orderservice.checkorders(response.rest_id)
                    $location.path('/manage');
                }                
            }
            else{
                $scope.loginfail=true;                
            }
        });

    }
}]);
