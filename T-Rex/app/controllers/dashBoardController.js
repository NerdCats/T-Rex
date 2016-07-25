'use strict';

app.controller('dashBoardController', ['$scope', '$interval', '$window', 'menus', 'host', 'timeAgo', 'restCall', 'dashboardFactory', dashBoardController]);

function dashBoardController($scope, $interval, $window, menus, host, timeAgo, restCall, dashboardFactory)  {

	var vm = $scope;	
	vm.menus = menus;	
	vm.autoRefreshState = true;
	vm.jobPerPage = 10;

	vm.newOrders = dashboardFactory.orders("ENQUEUED");

	vm.processingOrders = dashboardFactory.orders("IN_PROGRESS");
	
	vm.completedOrders = dashboardFactory.orders("COMPLETED");

	vm.createNewOrder = function () {
		$window.location.href = "#/order/create/new";
	}

	vm.jobPerPageChanged = function () {
		vm.newOrders.perPageTotal = vm.jobPerPage;
		vm.processingOrders.perPageTotal = vm.jobPerPage;
		vm.completedOrders.perPageTotal = vm.jobPerPage;
		vm.activate();
	}

	vm.AutoRefreshChanged = function () {
		if (vm.autoRefreshState) {
			dashboardFactory.startRefresh();
		} else {
			dashboardFactory.stopRefresh();
		}
	}
	vm.activate = function () {
		vm.newOrders.loadOrders();
		vm.processingOrders.loadOrders();
		vm.completedOrders.loadOrders();
		dashboardFactory.startRefresh(vm.newOrders);
	}
	vm.activate();	
}