angular.module('app')
    .controller('menuitemctrl', ['$scope', 'shared', 'restaurant','$location','fileUploadService', 
    	function ($scope, shared, restaurant,$location,fileUploadService) {
    		$scope.newitem = {};
    		$scope.menuitems = [];
    		$scope.restaurant={};
    		$scope.uid;
    		$scope.$on('$routeChangeSuccess', function () {
                $scope.uid = shared.getUser().id;
                
                restaurant.getRestaurant(shared.getUser().rest_id).then(function(response){
                    if(response){
						console.log(response);
                        $scope.restaurant = response;
                        $scope.menuitems = response.items;                        
                    }
                })

                
			})
			
			$scope.edit = function(idx){
				$scope.newitem = $scope.menuitems[idx];
				$('#editmodal').modal('show');
			}

            $scope.showaddmodal = function(idx){
            	$scope.newitem = {};
            	$('#addmodal').modal('show')
			}
			
			$scope.remove = function(idx){
				restaurant.removeitem($scope.menuitems[idx].item_id).then(function(response){
            		if(response){
						$scope.menuitems.splice(idx,1);
						alert("deleted");
					}
					else{
						alert("could not delete");
					}
            	})

			}

            $scope.edititem = function () {
            	restaurant.edititem($scope.newitem.item_id,$scope.newitem).then(function(response){
            		if(response){
						// for(var i=0;i<$scope.menuitems)
            			// $scope.menuitems[idx]=$scope.newitem;
            			$scope.newitem = {};
            			$('#editmodal').modal('hide');
					}
					else{
						$('#editmodal').modal('hide');
						alert("could not be edited");
					}
            	})
            	// body...
            }

            $scope.additem = function () {
            	restaurant.additem($scope.uid,$scope.newitem).then(function(response){
            		if(response){
						$scope.newitem.item_id = response;
            			$scope.menuitems.push($scope.newitem);
            			$scope.newitem = {};
            			$('#addmodal').modal('hide');
					}
					else{
						alert("not able to add");
						$('#addmodal').modal('hide');
					}
            	})
            	// body...
			}
			
			$scope.uploadFile = function(){
				var file = $scope.myFile;
				fileUploadService.uploadFileToUrl(file).then(function(response){
					if(response){
						$scope.newitem.image_url = response;
						alert("file uploaded succesfully");
					}
					else{
						alert("file upload failed");
					}
				})
			}

}])
