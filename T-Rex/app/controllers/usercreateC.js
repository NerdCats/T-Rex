'use strict';
app.controller('usercreateC', ['$scope', 'userService', usercreateC]);

function usercreateC($scope, userService) {

  	var vm = $scope;
  	vm.gender = ["MALE", "FEMALE"];
  	vm.userTypes = ["USER", "CNG_DRIVER", "BIKE_MESSENGER", "ENTERPRISE"];	
	vm.user = userService.getNewUser();
}