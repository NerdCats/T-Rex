'use strict';

app.controller('dashBoardController', ['$scope', '$interval', '$window', 'menus', 'host', 'timeAgo', 'restCall', 'dashboardFactory', 'jobSearch', dashBoardController]);

function dashBoardController($scope, $interval, $window, menus, host, timeAgo, restCall, dashboardFactory, jobSearch)  {

	var vm = $scope;	
	vm.menus = menus;	
	vm.autoRefreshState = true;
	vm.jobPerPage = 10;

	vm.jobTime = "all";

	vm.newOrders = dashboardFactory.orders("ENQUEUED");

	vm.processingOrders = dashboardFactory.orders("IN_PROGRESS");
	
	vm.completedOrders = dashboardFactory.orders("COMPLETED");

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

		vm.newOrders.searchParam.pageSize = vm.jobPerPage;
		vm.processingOrders.searchParam.pageSize = vm.jobPerPage;
		vm.completedOrders.searchParam.pageSize = vm.jobPerPage;

		vm.newOrders.jobTime(vm.jobTime);
		vm.processingOrders.jobTime(vm.jobTime);
		vm.completedOrders.jobTime(vm.jobTime);

		vm.newOrders.loadOrders();
		vm.processingOrders.loadOrders();
		vm.completedOrders.loadOrders();
		dashboardFactory.startRefresh(vm.newOrders);
	}
	vm.activate();	
}