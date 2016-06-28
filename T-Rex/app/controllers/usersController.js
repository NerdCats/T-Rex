'use strict';
app.controller('userController', ['$scope', '$http', '$window', 'userService', function($scope, $http, $window, userService){
	
	var vm = this;
	
	vm.Users = {Collection : [], pages: []};
	 
	userService.populateUsers(vm.Users, 25);
	
	vm.Register = function () {
		$window.location.href = '#/user/create';
	};

	vm.Details = function(Id){
		$window.location.href = '#/user/details/'+ Id;
	};
}])