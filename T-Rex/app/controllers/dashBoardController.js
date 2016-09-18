'use strict';

app.controller('dashBoardController', ['$scope', '$interval', '$window', 'menus', 'ngAuthSettings', 'timeAgo', 'restCall', 'dashboardFactory', dashBoardController]);

function dashBoardController($scope, $interval, $window, menus, ngAuthSettings, timeAgo, restCall, dashboardFactory)  {

	var vm = $scope;	
	vm.menus = menus;	
	vm.autoRefreshState = true;
	vm.jobPerPage = 50;
	vm.startDate = undefined;
	vm.endDate = undefined;
	vm.EnterpriseUser = null;
	vm.EnterpriseUsers = [];	

	vm.jobTime = "all";

	vm.newOrders = dashboardFactory.orders("ENQUEUED");
	vm.processingOrders = dashboardFactory.orders("IN_PROGRESS");	
	vm.completedOrders = dashboardFactory.orders("COMPLETED");
	vm.cancelledOrders = dashboardFactory.orders("CANCELLED");	
	

	dashboardFactory.getUserNameList("ENTERPRISE", vm.EnterpriseUsers);

	vm.clearDate = function () {
		vm.startDate = undefined;
		vm.endDate = undefined;


		vm.activate();
	}

	vm.setDate = function () {
		var startDateISO = undefined;
		var endDateISO = undefined;
		
		if (vm.startDate&&vm.endDate) {
			startDateISO = dashboardFactory.getIsoDate(vm.startDate,0,0,0);
			// new Date(vm.startDate.getFullYear(), vm.startDate.getMonth(), vm.startDate.getDate(), 0, 0, 0).toISOString();
			endDateISO = dashboardFactory.getIsoDate(vm.endDate,23,59,59);
			// new Date(vm.endDate.getFullYear(), vm.endDate.getMonth(), vm.endDate.getDate(), 23, 59, 59).toISOString();			
		}

		vm.newOrders.searchParam.CreateTime.startDate = startDateISO;
		vm.newOrders.searchParam.CreateTime.endDate = endDateISO;

		// vm.processingOrders.searchParam.startDate = startDateISO;
		// vm.processingOrders.searchParam.endDate = endDateISO;

		vm.completedOrders.searchParam.CompletionTime.startDate = startDateISO;
		vm.completedOrders.searchParam.CompletionTime.endDate = endDateISO;

		// FIXME: remember, in future, if there are any order STATE as returned, we need
		// to open up another list
		vm.cancelledOrders.searchParam.CreateTime.startDate = startDateISO;
		vm.cancelledOrders.searchParam.CreateTime.endDate = endDateISO;		
	}

	

	vm.AutoRefreshChanged = function () {
		if (vm.autoRefreshState) {
			dashboardFactory.startRefresh();
		} else {
			dashboardFactory.stopRefresh();
		}
	}


	vm.activate = function () {
		vm.newOrders.searchParam.UserName = vm.EnterpriseUser;
		vm.processingOrders.searchParam.UserName = vm.EnterpriseUser;
		vm.completedOrders.searchParam.UserName = vm.EnterpriseUser;
		vm.cancelledOrders.searchParam.UserName = vm.EnterpriseUser;	
		
		vm.newOrders.searchParam.pageSize = vm.jobPerPage;
		vm.processingOrders.searchParam.pageSize = vm.jobPerPage;
		vm.completedOrders.searchParam.pageSize = vm.jobPerPage;
		vm.cancelledOrders.searchParam.pageSize = vm.jobPerPage;
		
		vm.newOrders.isCompleted = 'IN_PROGRESS';
		vm.processingOrders.isCompleted = 'IN_PROGRESS';
		vm.completedOrders.isCompleted = 'IN_PROGRESS';
		vm.cancelledOrders.isCompleted = 'IN_PROGRESS';

		vm.setDate();

		vm.newOrders.loadOrders();
		vm.processingOrders.loadOrders();
		vm.completedOrders.loadOrders();
		vm.cancelledOrders.loadOrders();
		
		dashboardFactory.startRefresh(vm.newOrders);
	}
	vm.activate();
}