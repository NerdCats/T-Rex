'use strict';

app.controller('dashBoardController', ['$rootScope', '$scope', '$http', '$location', '$interval', '$window', 'menus', 'templates', 'host', 'dashboardFactory', dashBoardController]);

function dashBoardController($rootScope, $scope, $http, $location, $interval, $window, menus, templates, host, dashboardFactory) {

	var vm = $scope;	
	vm.menus = menus;
	vm.templates = templates;
	vm.selected = [];
	vm.processingOrders = [];

	// the isCompleted value of the orders has 4 states IN_PROGRESS, SUCCESSFULL, EMPTY, FAILED
	// these states indicates the http request's state and content of the page
	vm.newOrders = {orders: [], pagination: null, pages:[], total: 0, isCompleted : '', state: "ENQUEUED" };
	vm.processingOrders = {orders: [], pagination: null, pages:[], total: 0, isCompleted : '', state: "IN_PROGRESS" };
	vm.completedOrders = {orders: [], pagination: null, pages:[], total: 0, isCompleted : '', state: "COMPLETED" };

	vm.createNewOrder = function () {
		$window.location.href = "#/order/create/new";
	}

	vm.loadNextPage = function (orders) {
		var nextPageUrl = orders.pagination.NextPage;
		console.log(orders);
		console.log(nextPageUrl);
		if (nextPageUrl) {
			dashboardFactory.populateOrdersTable(orders, nextPageUrl);			
		}
	}

	vm.loadPrevPage = function (orders) {
		var prevPageUrl = orders.pagination.PrevPage;		
		console.log(orders);
		console.log(prevPageUrl);
		if (prevPageUrl) {
			dashboardFactory.populateOrdersTable(orders, prevPageUrl);			
		}
	}

	vm.loadPage = function (orders, pageNo) {
		var pageUrl = dashboardFactory.jobListUrlMaker(orders.state, true, pageNo, 10)
		console.log(pageNo);
		console.log(pageUrl);
		console.log(orders);
		dashboardFactory.populateOrdersTable(orders, pageUrl);
	}

	var URL_ENQUEUED = "api/Job/odata?$filter=State eq 'ENQUEUED'";
	var URL_IN_PROGRESS = "api/Job/odata?$filter=State eq 'IN_PROGRESS'";
	var URL_COMPLETED = "api/Job/odata?$filter=State eq 'COMPLETED'";


	vm.loadEnqueuedOrders = function (){
		vm.newOrders.isCompleted = 'IN_PROGRESS';
		var newOrdersUrl = dashboardFactory.jobListUrlMaker("ENQUEUED", true, 0, 10)
		dashboardFactory.populateOrdersTable(vm.newOrders, newOrdersUrl);
	}

	vm.loadInProgressOrders = function (){
		vm.processingOrders.isCompleted = 'IN_PROGRESS';
		var processingOrdersUrl = dashboardFactory.jobListUrlMaker("IN_PROGRESS", true, 0, 10)
		dashboardFactory.populateOrdersTable(vm.processingOrders, processingOrdersUrl);
	}
	
	vm.loadCompletedOrders = function () {
		vm.completedOrders.isCompleted = 'IN_PROGRESS';
		var completedOrdersUrl = dashboardFactory.jobListUrlMaker("COMPLETED", true, 0, 10)
		dashboardFactory.populateOrdersTable(vm.completedOrders, completedOrdersUrl);
	}



	var autoRefresh;
	vm.autoRefreshState = true;
	vm.AutoRefreshChanged = function () {
		if (vm.autoRefreshState) {
			vm.StartRefresh();
		} else {
			vm.StopRefresh();
		}
	}
	vm.StartRefresh = function () {
		if (angular.isDefined(autoRefresh)) return;
		autoRefresh = $interval(function () {
			console.log("start");
			vm.newOrders.isCompleted = 'IN_PROGRESS';
			vm.newOrders.orders= [];
			vm.newOrders.pages = [];
			vm.loadEnqueuedOrders();	
		}, 60000); //60000
	}
	

	vm.StopRefresh = function () {
		if (angular.isDefined(autoRefresh)) {
			console.log("stop")
			$interval.cancel(autoRefresh);
			autoRefresh = undefined;
		}
	}

	vm.activate = function () {
		vm.loadEnqueuedOrders();
		vm.loadInProgressOrders();
		vm.loadCompletedOrders();
		vm.StartRefresh();
	}
	vm.activate();
	
}