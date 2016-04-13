'use strict';

app.controller('dashBoardController', function ($rootScope, $scope, $http, $location, $interval, $mdDialog, $mdMedia,$window,
												menus, templates, host, dashboardFactory) {

	var vm = $scope;	
	vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');	
	vm.menus = menus;
	vm.templates = templates;
	vm.selected = [];
	vm.newOrders = [];
	vm.processingOrders = [];
	vm.newOrders = {orders: [], pages:[]};
	vm.processingOrders = {orders: [], pages:[]};
	vm.completedOrders = {orders: [], pages:[]};
	vm.loadNextPage = dashboardFactory.loadNextPage;
	
	var URL_ENQUEUED = "api/Job/odata?$filter=State eq 'ENQUEUED'";
	var URL_IN_PROGRESS = "api/Job/odata?$filter=State eq 'IN_PROGRESS'";	

	dashboardFactory.populateOrdersTable(vm.newOrders, "ENQUEUED", true, 0, 25);
	dashboardFactory.populateOrdersTable(vm.processingOrders, "IN_PROGRESS", true, 0, 25);
	dashboardFactory.populateOrdersTable(vm.completedOrders, "COMPLETED", true, 0, 25);
});