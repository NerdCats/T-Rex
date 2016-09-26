'use strict';
app.controller('userDetailsC', ['$scope', '$routeParams', 'userService', 'ngAuthSettings', 'restCall', 'dashboardFactory', userDetailsC]);

function userDetailsC($scope, $routeParams, userService, ngAuthSettings, restCall, dashboardFactory){
	
	var vm = $scope;
	vm.id = $routeParams.id;
	vm.User = {};
	vm.isAsset = false;
	vm.isEnterprise = false;
	vm.isUser = false;
	vm.jobPerPage = 10;
	
	vm.processingOrders = dashboardFactory.orders("IN_PROGRESS");
	vm.completedOrders = dashboardFactory.orders("COMPLETED");
	vm.cancelledOrders = dashboardFactory.orders("CANCELLED");


	var userUrl = ngAuthSettings.apiServiceBaseUri + "api/account/profile/" + vm.id;

	function userFound(response) {
		vm.User = response.data;
		if (vm.User.Type == "USER") 
			vm.isUser = true;
		else if (vm.User.Type == "BIKE_MESSENGER" || vm.User.Type == "CNG_DRIVER")
			vm.isAsset = true;
		else if (vm.User.Type == "ENTERPRISE") 
			vm.isEnterprise = true;

		console.log(vm.User.Type);
		console.log(vm.isUser);
	}
	function userNotFound(error) {
		console.log(error)
	}
	restCall('GET', userUrl, null, userFound, userNotFound);


	var asignedJobUrl = ngAuthSettings.apiServiceBaseUri + "api/account/" + vm.id + "/jobs";
	function jobsFound(response) {
		vm.UsersJobs = response.data;
		console.log(vm.UsersJobs);
	}
	function jobsNotFound(error) {
		console.log(error)
	}
	restCall('GET', asignedJobUrl, null, jobsFound, jobsNotFound);


	vm.activate = function () {			
		vm.processingOrders.searchParam.pageSize = vm.jobPerPage;
		vm.completedOrders.searchParam.pageSize = vm.jobPerPage;
		vm.cancelledOrders.searchParam.pageSize = vm.jobPerPage;
				
		vm.processingOrders.isCompleted = 'IN_PROGRESS';
		vm.completedOrders.isCompleted = 'IN_PROGRESS';
		vm.cancelledOrders.isCompleted = 'IN_PROGRESS';
		
		vm.processingOrders.searchParam.userId = vm.id;
		vm.completedOrders.searchParam.userId = vm.id;
		vm.cancelledOrders.searchParam.userId = vm.id;
		
		vm.processingOrders.loadOrders();
		vm.completedOrders.loadOrders();
		vm.cancelledOrders.loadOrders();
	}
	vm.activate();
}