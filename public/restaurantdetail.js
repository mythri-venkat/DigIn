angular.module('app')
    .controller('restdetailctrl', ['$scope', 'shared', 'restaurant','$location', 'fileUploadService',
    function ($scope , shared, restaurant,$location,fileUploadService) {

        $scope.rest = {};
        $scope.rest_id;
        $scope.cust_id;
        $scope.$on('$routeChangeSuccess', function () {
            var usr = shared.getUser();
            $scope.rest_id = usr.rest_id;
            $scope.cust_id = usr.id;
            restaurant.getRestaurant(usr.rest_id).then(
                function(response){
                    if(response){
                        $scope.rest = response;
                    }
                    else{
                        alert("unable to retrieve data");
                    }
                }
            )
        })

        $scope.submit = function(){
            restaurant.editprofile($scope.rest_id,$scope.cust_id,$scope.rest).then(function(response){
                if(response){
                    alert("successfully edited");
                    
                }
                else{
                    alert("unable to retrieve data");
                }

            },function(){

            })
        }

        $scope.uploadFile = function(){
            var file = $scope.myFile;
            fileUploadService.uploadFileToUrl(file).then(function(response){
                if(response){
                    $scope.rest.image_url = response;
                    alert("file uploaded succesfully");
                }
                else{
                    alert("file upload failed");
                }
            })
        }


    }])
    .directive('demoFileModel', function ($parse) {
        return {
            restrict: 'A', //the directive can be used as an attribute only
 
            /*
             link is a function that defines functionality of directive
             scope: scope associated with the element
             element: element on which this directive used
             attrs: key value pair of element attributes
             */
            link: function (scope, element, attrs) {
                var model = $parse(attrs.demoFileModel),
                    modelSetter = model.assign; //define a setter for demoFileModel
 
                //Bind change event on the element
                element.bind('change', function () {
                    //Call apply on scope, it checks for value changes and reflect them on UI
                    scope.$apply(function () {
                        //set the model value
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    })
    .service('fileUploadService',['$http',function($http){
        var strurl = "http://127.0.0.1:5001/upload"
        this.uploadFileToUrl = function (file) {
            //FormData, object of key/value pair for form fields and values
            var fileFormData = new FormData();
            fileFormData.append('file', file);
            return $http.post(strurl, fileFormData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
 
            }).then(function (response) {
                if(response.status =='200'){
                    return response.data;
                }
                else{
                    return false;
                }
 
            },function (error) {
                return false;
            });
        }
    }])