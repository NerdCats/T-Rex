'use strict';

app.controller('dashBoardController', function ($scope, $http, $location, $interval, $mdDialog, $mdMedia,$window,
												menus, templates, populateOrdersTable, loadNextPage) {

	var vm = $scope;
	vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');	
	vm.menus = menus;
	vm.templates = templates;
	vm.newOrders = [];
	vm.processingOrders = [];
	vm.newOrders = {orders: [], pages:[]};
	vm.processingOrders = {orders: [], pages:[]};
	vm.loadNextPage = loadNextPage;
	
	var url1 = "http://localhost:23873/api/Job?envelope=true";
	var url2 = "http://127.0.0.1:8080/json/orders.json";

	populateOrdersTable(url1, vm.newOrders, "ENQUEUED");
	populateOrdersTable(url1, vm.processingOrders, "IN_PROGRESS");
});