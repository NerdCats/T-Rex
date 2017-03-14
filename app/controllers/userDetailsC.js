(function () {
	
	'use strict';

	app.controller('userDetailsC', userDetailsC);

	function userDetailsC($scope, $routeParams, ngAuthSettings, restCall, dashboardFactory, Areas){
		
		var vm = $scope;
		vm.userId = $routeParams.id;
		vm.User = {};	
		vm.isLoadingUser = true;
		vm.EnterpriseUsers = [];
		vm.Areas = Areas;
		vm.DeliveryArea = null;
		vm.PickupArea = null;
		
		vm.allOrders = dashboardFactory.orders(null);
		vm.pendingOrders = dashboardFactory.orders("ENQUEUED");
		vm.inProgressOrders = dashboardFactory.orders("IN_PROGRESS");
		vm.assignedOrders = dashboardFactory.orders(null);

		dashboardFactory.getUserNameList("ENTERPRISE", vm.EnterpriseUsers);

		var userUrl = ngAuthSettings.apiServiceBaseUri + "api/account/profile/" + vm.userId;

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

		vm.setDate = function () {
			var startDateISO = undefined;
			var endDateISO = undefined;
			
			if (vm.startDate&&vm.endDate) {
				startDateISO = dashboardFactory.getIsoDate(vm.startDate,0,0,0);			
				endDateISO = dashboardFactory.getIsoDate(vm.endDate,23,59,59);			
			}

			vm.pendingOrders.searchParam.CreateTime.startDate = startDateISO;
			vm.pendingOrders.searchParam.CreateTime.endDate = endDateISO;

			// vm.inProgressOrders.searchParam.CreateTime.startDate = startDateISO;
			// vm.inProgressOrders.searchParam.CreateTime.endDate = endDateISO;
		}

		vm.clearDate = function () {
			vm.startDate = undefined;
			vm.endDate = undefined;

			vm.activate();
		}

		vm.loadUserOrEnterpriseJobs = function () {		
			vm.allOrders.isCompleted = 'IN_PROGRESS';
			vm.allOrders.searchParam.UserName = vm.User.UserName;
			vm.allOrders.searchParam.PageSize = 50;		
			vm.allOrders.searchParam.DeliveryArea = vm.DeliveryArea;
			vm.allOrders.searchParam.PickupArea = vm.PickupArea;
			vm.allOrders.loadOrders();
		}

		vm.load_Pending_Or_Inprogress_Jobs_For_Asset_To_Assign = function () {

			vm.setDate();
			
			vm.pendingOrders.searchParam.UserName = vm.EnterpriseUser;
			vm.inProgressOrders.searchParam.UserName = vm.EnterpriseUser;
			
			vm.pendingOrders.searchParam.DeliveryArea = vm.DeliveryArea;
			vm.inProgressOrders.searchParam.DeliveryArea = vm.DeliveryArea;
			
			vm.pendingOrders.searchParam.PickupArea = vm.PickupArea;
			vm.inProgressOrders.searchParam.PickupArea = vm.PickupArea;
			
			vm.pendingOrders.searchParam.PageSize = 50;

			vm.pendingOrders.isCompleted = 'IN_PROGRESS';
			vm.pendingOrders.assign.showPickupAssign = true;
			vm.pendingOrders.assign.showdeliveryAssign = true;
			vm.pendingOrders.assign.showsecuredeliveryAssign = true;
			vm.pendingOrders.assign.assetRef = vm.userId;
			vm.pendingOrders.loadOrders();
			
			vm.inProgressOrders.isCompleted = 'IN_PROGRESS';
			vm.pendingOrders.searchParam.PageSize = 50;
			vm.inProgressOrders.assign.showPickupAssign = true;
			vm.inProgressOrders.assign.showdeliveryAssign = true;
			vm.inProgressOrders.assign.showsecuredeliveryAssign = true;
			vm.inProgressOrders.assign.assetRef = vm.userId;
			vm.inProgressOrders.loadOrders();	

			vm.assignedOrders.searchParam.userId = vm.userId;
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
})();