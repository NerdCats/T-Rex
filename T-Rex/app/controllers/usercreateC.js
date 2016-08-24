'use strict';
app.controller('usercreateC', ['$scope', 'userService', usercreateC]);

function usercreateC($scope,userService) {

  var vm = $scope;

  vm.gender = ["MALE", "FEMALE"];
  vm.userTypes = ["USER", "CNG_DRIVER", "BIKE_MESSENGER", "ENTERPRISE"];

	vm.userType = "USER";
	vm.user = {
		UserName : "",
		Password : "",
		ConfirmPassword : "",
		Email : "",
		PhoneNumber : "",
		PicUri : "",
		Type : "",
		FirstName : "",
		LastName : "",
		Age : "",
		Gender : "",
		Address : "",      
		NationalId : "",
		DrivingLicenceId : "",
		ContactPersonName : "",
		Website : ""
	};

	vm.RegisterNewAsset = function () {
		userService.registerNewUser(vm.user);
	} 
	
}