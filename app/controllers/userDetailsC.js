'use strict';
app.controller('userDetailsC', ['$scope', '$routeParams', 'ngAuthSettings', 'restCall', 'dashboardFactory', userDetailsC]);

function userDetailsC($scope, $routeParams, ngAuthSettings, restCall, dashboardFactory){
	
	var vm = $scope;
	vm.id = $routeParams.id;
	vm.User = {};	
	vm.isLoadingUser = true;
	
	vm.allOrders = dashboardFactory.orders(null);
	vm.pendingOrders = dashboardFactory.orders("ENQUEUED");
	vm.inProgressOrders = dashboardFactory.orders("IN_PROGRESS");
	vm.assignedOrders = dashboardFactory.orders(null)

	var userUrl = ngAuthSettings.apiServiceBaseUri + "api/account/profile/" + vm.id;

	function userFound(response) {
		vm.isLoadingUser = false;
		vm.User = response.data;
		if (vm.User.Type == "USER" || vm.User.Type == "ENTERPRISE")
			vm.loadUserOrEnterpriseJobs();
		else if (vm.User.Type == "BIKE_MESSENGER" || vm.User.Type == "CNG_DRIVER")
			vm.load_Pending_Or_Inprogress_Jobs_For_Asset_To_Assign();		
	}
	function userNotFound(error) {
		console.log(error)
		vm.isLoadingUser = false;
	}
	restCall('GET', userUrl, null, userFound, userNotFound);

	vm.loadUserOrEnterpriseJobs = function () {		
		vm.allOrders.isCompleted = 'IN_PROGRESS';
		vm.allOrders.searchParam.UserName = vm.User.UserName;
		vm.allOrders.searchParam.PageSize = 50;		
		vm.allOrders.loadOrders();
	}

	vm.load_Pending_Or_Inprogress_Jobs_For_Asset_To_Assign = function () {
				
		vm.pendingOrders.isCompleted = 'ENQUEUED';		
		vm.pendingOrders.searchParam.PageSize = 50;
		vm.pendingOrders.assign.pickup = true;
		vm.pendingOrders.assign.delivery = true;
		vm.pendingOrders.assign.securedelivery = true;
		vm.pendingOrders.loadOrders();

		
		
		vm.inProgressOrders.isCompleted = 'IN_PROGRESS';		
		vm.pendingOrders.searchParam.PageSize = 50;
		vm.inProgressOrders.assign.pickup = true;
		vm.inProgressOrders.assign.delivery = true;
		vm.inProgressOrders.assign.securedelivery = true;
		vm.inProgressOrders.loadOrders();

		

		vm.assignedOrders.searchParam.userId = vm.id;
		vm.assignedOrders.searchParam.PageSize = 50;
		vm.assignedOrders.loadOrders();
	}

	vm.activate = function () {
		if (vm.User.Type === "USER" || vm.User.Type === "ENTERPRISE") {
			vm.loadUserOrEnterpriseJobs();
		}
		else if (vm.User.Type === "BIKE_MESSENGER") {
			vm.load_Pending_Or_Inprogress_Jobs_For_Asset_To_Assign();
		}
	}
}