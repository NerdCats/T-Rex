'use strict';

app.controller('dashBoardController', ['$scope', '$interval', '$window', 'menus', 'host', 'timeAgo', 'restCall', 'dashboardFactory', 'jobSearch', dashBoardController]);

function dashBoardController($scope, $interval, $window, menus, host, timeAgo, restCall, dashboardFactory, jobSearch)  {

	var vm = $scope;	
	vm.menus = menus;	
	vm.autoRefreshState = true;
	vm.jobPerPage = 10;
	vm.EnterpriseUser = null;
	vm.EnterpriseUsers = [];	

	vm.jobTime = "all";

	vm.newOrders = dashboardFactory.orders("ENQUEUED");

	vm.processingOrders = dashboardFactory.orders("IN_PROGRESS");
	
	vm.completedOrders = dashboardFactory.orders("COMPLETED");

	vm.cancelledOrders = dashboardFactory.orders("CANCELLED");
	

	function loadUserName(_EnterpriseUsers) {
		function success(response) {
			vm.EnterpriseUsers.push("all");
			angular.forEach(response.data.data, function (value, keys) {
				_EnterpriseUsers.push(value.UserName);
			});
			console.log(_EnterpriseUsers)
		}
		function error(error) {
			console.log(error);
		}
		var enterpriseUsersUrl = host + "api/Account/odata?$filter=Type eq 'Enterprise'&PageSize=50";
		restCall('GET', enterpriseUsersUrl, null, success, error);
	}

	loadUserName(vm.EnterpriseUsers);

	vm.createNewOrder = function () {
		$window.location.href = "#/order/create/new";
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

		vm.newOrders.jobTime(vm.jobTime);
		vm.processingOrders.jobTime(vm.jobTime);
		vm.completedOrders.jobTime(vm.jobTime);
		vm.cancelledOrders.jobTime(vm.jobTime);

		vm.newOrders.loadOrders();
		vm.processingOrders.loadOrders();
		vm.completedOrders.loadOrders();
		vm.cancelledOrders.loadOrders();
		
		dashboardFactory.startRefresh(vm.newOrders);
	}
	vm.activate();
}