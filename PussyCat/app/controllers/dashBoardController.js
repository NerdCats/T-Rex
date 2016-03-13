'use strict';

app.controller('dashBoardController', function ($scope, $http, $location, $interval, $mdDialog, $mdMedia,$window,
												menus, templates, dashboardFactory) {

	var vm = $scope;
	vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');	
	vm.menus = menus;
	vm.templates = templates;
	vm.newOrders = [];
	vm.processingOrders = [];
	vm.newOrders = {orders: [], pages:[]};
	vm.processingOrders = {orders: [], pages:[]};
	vm.loadNextPage = dashboardFactory.loadNextPage;
	
	var URL_ENQUEUED = "http://localhost:23873/api/Job/odata?$filter=State eq 'ENQUEUED'";
	var URL_IN_PROGRESS = "http://localhost:23873/api/Job/odata?$filter=State eq 'IN_PROGRESS'";
	var url3 = "http://127.0.0.1:8080/json/orders.json";

	dashboardFactory.populateOrdersTable(vm.newOrders, "ENQUEUED", true, 0, 25);
	dashboardFactory.populateOrdersTable(vm.processingOrders, "IN_PROGRESS", true, 0, 25);
});