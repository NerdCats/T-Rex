'use strict';
app.controller('userController', ['$scope', '$http', '$window', 'userService', function($scope, $http, $window, userService){
	
	var vm = $scope;
	
	vm.Users = userService.users();
	 
	vm.Users.loadUsers();
	
	vm.Register = function () {
		$window.location.href = '#/user/create';
	};

	vm.Details = function(Id){
		$window.location.href = '#/user/details/'+ Id;
	};
}])