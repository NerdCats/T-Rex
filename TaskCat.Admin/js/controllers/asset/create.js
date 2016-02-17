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
  	
  	$scope.Register = function(){
  		console.log($scope.asset);
  	}

});