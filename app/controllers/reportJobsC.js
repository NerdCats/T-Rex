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

	console.log("vm.report.searchParam.startdate : " + vm.report.searchParam.startdate)
	console.log("vm.report.searchParam.enddate : " + vm.report.searchParam.enddate)
	console.log("vm.report.searchParam.state : " + vm.report.searchParam.state)
	console.log("vm.report.searchParam.username : " + vm.report.searchParam.username)
	console.log("vm.report.searchParam.usertype : " + vm.report.searchParam.usertype)
	console.log("vm.report.searchParam.userid : " + vm.report.searchParam.userid)

	vm.activate = function () {
		vm.report.loadReport();
	}
	vm.activate();

	vm.getCssClass = function (state) {		
		return dashboardFactory.getProperWordWithCss(state);
	}
}