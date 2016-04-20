'use strict';

app.controller('dashBoardController', function ($rootScope, $scope, $http, $location, $interval, $mdDialog, $mdMedia,$window,
												menus, templates, host, dashboardFactory) {

	var vm = $scope;	
	vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');	
	vm.menus = menus;
	vm.templates = templates;
	vm.selected = [];	
	vm.processingOrders = [];
	vm.newOrders = {orders: [], pages:[], total: 0};
	vm.processingOrders = {orders: [], pages:[], total: 0};
	vm.completedOrders = {orders: [], pages:[], total: 0};
	vm.loadNextPage = dashboardFactory.loadNextPage;
	vm.createNewOrder = function () {
		$window.location.href = "#/order/create";
	}
	
	var URL_ENQUEUED = "api/Job/odata?$filter=State eq 'ENQUEUED'";
	var URL_IN_PROGRESS = "api/Job/odata?$filter=State eq 'IN_PROGRESS'";	

	dashboardFactory.populateOrdersTable(vm.newOrders, "ENQUEUED", true, 0, 25);
	dashboardFactory.populateOrdersTable(vm.processingOrders, "IN_PROGRESS", true, 0, 25);
	dashboardFactory.populateOrdersTable(vm.completedOrders, "COMPLETED", true, 0, 25);
});