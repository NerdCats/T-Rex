'use strict';
app.controller('reportC', ['$scope', 'ngAuthSettings', 'restCall', 'dashboardFactory', 'queryService', reportC]);

function reportC($scope, ngAuthSettings, restCall, dashboardFactory, queryService){
	var vm = $scope;
	vm.jobStates = ["ENQUEUED", "IN_PROGRESS", "COMPLETED"]
	vm.jobSearchResult = dashboardFactory.orders("IN_PROGRESS");
	vm.slectedStartDate = new Date();
	vm.slectedEndDate = new Date();	

	vm.loadNextPage = function (page) {
		jobSearchResult.searchParam.loadPage(page);		
	}

	

	vm.Search = function () {
		vm.slectedStartDate = new Date(vm.slectedStartDate.getFullYear(), vm.slectedStartDate.getMonth(), vm.slectedStartDate.getDate(), 0, 0, 0);
		vm.slectedEndDate = new Date(vm.slectedEndDate.getFullYear(), vm.slectedEndDate.getMonth(), vm.slectedEndDate.getDate(), 23, 59, 59);

		vm.jobSearchResult.searchParam.startDate = vm.slectedStartDate.toISOString();
		vm.jobSearchResult.searchParam.endDate = vm.slectedEndDate.toISOString();

		vm.jobSearchResult.isCompleted = "IN_PROGRESS";
		vm.jobSearchResult.loadOrders();
	}	
}