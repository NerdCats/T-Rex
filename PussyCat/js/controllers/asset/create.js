app.controller('createAssetController', function ($scope,$http,$interval,$mdDialog,$mdMedia,$location,$window,menus,templates) {

	$scope.menus = menus;
	$scope.templates = templates;
	
	$scope.gender = ["MALE", "FEMALE"];
	$scope.type = ["USER", "CNG_DRIVER", "BIKE_MESSENGER"];

  	$scope.asset = {
  		UserName : "",
		Password : "",
		ConfirmPassword : "",
		Email : "",
		PhoneNumber : "",
		FirstName : "",
		LastName : "",
		Age : "",
		Gender : "",
		Address : "",
		PicUri : "",
		Type : "",
		NationalId : "",
		DrivingLicenceId : ""
  	}
  	
  	$scope.RegisterNewAsset = function(){
  		console.log($scope.asset);
  		$http({
  			method: 'POST',
  			url: 'http://localhost:23873/api/Account/Register',
  			data: $scope.asset,
  			header: {
  				'Content-Type' : 'application/json'
  			} 
  		}).then(function success(response) {
  			console.log("success : ");
  			console.log(response);
  			$window.location.href = '#/asset';

  		}, function error(response) {
  			console.log("error : ");
  			console.log(response);
  		});
  	}

});