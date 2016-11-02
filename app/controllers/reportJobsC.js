app.controller('reportJobsC', ['$scope', '$routeParams', '$http', 'reportJobsService', 'dashboardFactory', reportJobsC])

function reportJobsC($scope, $routeParams, $http, reportJobsService, dashboardFactory){

	var vm = $scope;	
	vm.report = reportJobsService.report();

	vm.report.searchParam.startdate = $routeParams.startdate;
	vm.report.searchParam.enddate = $routeParams.enddate;
	if ($routeParams.state) vm.report.searchParam.state = $routeParams.state;
	if ($routeParams.username) vm.report.searchParam.username = $routeParams.username;
	if ($routeParams.usertype) vm.report.searchParam.usertype = $routeParams.usertype;
	if ($routeParams.userid) vm.report.searchParam.userid = $routeParams.userid;

	vm.activate = function () {
		vm.report.loadReport();
	}
	vm.activate();

	vm.getCssClass = function (state) {		
		return dashboardFactory.getProperWordWithCss(state);
	}
}