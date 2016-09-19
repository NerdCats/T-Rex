'use strict';
app.controller('reportC', ['$scope', 'ngAuthSettings', 'restCall', 'dashboardFactory', 'reportService', 'queryService', 'reportServiceUrl', reportC]);

function reportC($scope, ngAuthSettings, restCall, dashboardFactory, reportService, queryService, reportServiceUrl){
	var vm = $scope;	
	vm.b2bReport = reportService.getReport();
	vm.b2cReport = reportService.getReport();
	vm.b2cReport.searchParam.type = "USER";
	vm.slectedStartDate = new Date();
	vm.slectedEndDate = new Date();

	vm.loadNextPage = function (page) {
		vm.b2bReport.searchParam.loadPage(page);
	}

	vm.Search = function () {
		vm.b2bReport.searchParam.startdate = dashboardFactory.getIsoDate(vm.slectedStartDate, 0, 0, 0);
		vm.b2bReport.searchParam.enddate = dashboardFactory.getIsoDate(vm.slectedEndDate, 23, 59, 59);
		vm.b2bReport.getReport();

		vm.b2cReport.searchParam.startdate = dashboardFactory.getIsoDate(vm.slectedStartDate, 0, 0, 0);
		vm.b2cReport.searchParam.enddate = dashboardFactory.getIsoDate(vm.slectedEndDate, 23, 59, 59);
		vm.b2cReport.getReport();
	}

	vm.goToReportJobs = function (user, state) {
		$window.open("#/report/jobs?" + "startdate=" + vm.startdate + "&enddate="+ vm.enddate + "&user=" + user + "&state" + state, '_blank');
	}

	vm.Search();
}