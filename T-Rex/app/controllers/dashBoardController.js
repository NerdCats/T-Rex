'use strict';

app.controller('dashBoardController', function ($rootScope, $scope, $http, $location, $interval, $mdDialog, $mdMedia, $window,
												menus, templates, host, dashboardFactory) {

	var vm = $scope;
	vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
	vm.menus = menus;
	vm.templates = templates;
	vm.selected = [];
	vm.processingOrders = [];
	vm.newOrders = {orders: [], pages:[], total: 0, isCompleted : false };
	vm.processingOrders = {orders: [], pages:[], total: 0, isCompleted : false };
	vm.completedOrders = {orders: [], pages:[], total: 0, isCompleted : false };

	vm.createNewOrder = function () {
		$window.location.href = "#/order/create/new";
	}

	vm.loadNextPage = function (orders ,state, page) {
		var nextPageUrl = dashboardFactory.jobListUrlMaker(state, true, page, 25);
		dashboardFactory.loadNextPage(orders, nextPageUrl);
	}

	var URL_ENQUEUED = "api/Job/odata?$filter=State eq 'ENQUEUED'";
	var URL_IN_PROGRESS = "api/Job/odata?$filter=State eq 'IN_PROGRESS'";
	var URL_COMPLETED = "api/Job/odata?$filter=State eq 'COMPLETED'";


	function loadEnqueuedOrders(){
		var newOrdersUrl = dashboardFactory.jobListUrlMaker("ENQUEUED", true, 0, 25)
		dashboardFactory.populateOrdersTable(vm.newOrders, newOrdersUrl);
	}

	function loadInProgressOrders(){
		var processingOrdersUrl = dashboardFactory.jobListUrlMaker("IN_PROGRESS", true, 0, 25)
		dashboardFactory.populateOrdersTable(vm.processingOrders, processingOrdersUrl);
	}
	
	function loadCompletedOrders() {
		var completedOrdersUrl = dashboardFactory.jobListUrlMaker("COMPLETED", true, 0, 25)
		dashboardFactory.populateOrdersTable(vm.completedOrders, completedOrdersUrl);
	}

	loadEnqueuedOrders();
	loadInProgressOrders();
	loadCompletedOrders();

	$interval(function () {
		vm.newOrders.isCompleted = false;
		loadEnqueuedOrders();	
	}, 60000);

	
});