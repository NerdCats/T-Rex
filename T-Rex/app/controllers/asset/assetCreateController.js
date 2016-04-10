app.controller('createAssetController', function ($scope,assetsFactory) {

    var vm = $scope;

	vm.gender = ["MALE", "FEMALE"];
	vm.type = ["USER", "CNG_DRIVER", "BIKE_MESSENGER"];

  	vm.asset = {
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
  	};
    
  	vm.RegisterNewAsset = assetsFactory.registerNewAsset;
    
});