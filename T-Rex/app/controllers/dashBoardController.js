'use strict';

app.controller('dashBoardController', ['$rootScope', '$scope', '$http', '$location', '$interval', '$mdDialog', '$mdMedia', '$window', 'menus', 'templates', 'host', 'dashboardFactory', dashBoardController]);

function dashBoardController($rootScope, $scope, $http, $location, $interval, $mdDialog, $mdMedia, $window, menus, templates, host, dashboardFactory) {

	var vm = $scope;
	vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
	vm.menus = menus;
	vm.templates = templates;
	vm.selected = [];
	vm.processingOrders = [];

	// the isCompleted value of the orders has 4 states IN_PROGRESS, SUCCESSFULL, EMPTY, FAILED
	// these states indicates the http request's state and content of the page
	vm.newOrders = {orders: [], pages:[], total: 0, isCompleted : '' };
	vm.processingOrders = {orders: [], pages:[], total: 0, isCompleted : '' };
	vm.completedOrders = {orders: [], pages:[], total: 0, isCompleted : '' };

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


	vm.loadEnqueuedOrders = function (){
		vm.newOrders.isCompleted = 'IN_PROGRESS';
		var newOrdersUrl = dashboardFactory.jobListUrlMaker("ENQUEUED", true, 0, 25)
		dashboardFactory.populateOrdersTable(vm.newOrders, newOrdersUrl);
	}

	vm.loadInProgressOrders = function (){
		vm.processingOrders.isCompleted = 'IN_PROGRESS';
		var processingOrdersUrl = dashboardFactory.jobListUrlMaker("IN_PROGRESS", true, 0, 25)
		dashboardFactory.populateOrdersTable(vm.processingOrders, processingOrdersUrl);
	}
	
	vm.loadCompletedOrders = function () {
		vm.completedOrders.isCompleted = 'IN_PROGRESS';
		var completedOrdersUrl = dashboardFactory.jobListUrlMaker("COMPLETED", true, 0, 25)
		dashboardFactory.populateOrdersTable(vm.completedOrders, completedOrdersUrl);
	}

	vm.loadEnqueuedOrders();
	vm.loadInProgressOrders();
	vm.loadCompletedOrders();

	$interval(function () {
		vm.newOrders.isCompleted = 'IN_PROGRESS';
		vm.loadEnqueuedOrders();	
	}, 60000); 
}