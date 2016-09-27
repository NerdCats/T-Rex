'use strict';
app.controller('userController', ['$scope', '$http', '$window', 'userService', function($scope, $http, $window, userService){
	
	var vm = $scope;
	vm.userPerPage = 50;
	vm.user = userService.users("USER");
	vm.enterprise = userService.users("ENTERPRISE");
	vm.assets = userService.users("BIKE_MESSENGER");
	 
	
	
	vm.Register = function () {
		$window.location.href = '#/user/create';
	};

	vm.Details = function(Id){
		$window.location.href = '#/user/details/'+ Id;
	};



	vm.activate = function () {
		vm.user.searchParam.pageSize = vm.userPerPage;
		vm.enterprise.searchParam.pageSize = vm.userPerPage;
		vm.assets.searchParam.pageSize = vm.userPerPage;

		vm.user.loadUsers();
		vm.enterprise.loadUsers();
		vm.assets.loadUsers();
	}
	vm.activate();
}])