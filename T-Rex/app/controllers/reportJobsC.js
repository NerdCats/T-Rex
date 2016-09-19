app.controller('reportJobsC', ['$scope', '$routeParams', 'dashboardFactory', reportJobsC])

function reportJobsC($scope, $routeParams, dashboardFactory){

	var vm = $scope;
	vm.startdate = $routeParams.startdate;
	vm.enddate = $routeParams.enddate;
	vm.state = $routeParams.state;
	vm.user = $routeParams.user;

	console.log(vm.startdate + "\n"+ vm.enddate + "\n"+ vm.state + "\n"+ vm.user);
	vm.reportJobs = dashboardFactory.orders(null);

	vm.reportJobs.searchParam.UserName = $routeParams.user;
	vm.reportJobs.searchParam.jobState = $routeParams.state;
	vm.reportJobs.searchParam.CreateTime.startDate = $routeParams.startdate;
	vm.reportJobs.searchParam.CreateTime.endDate = $routeParams.enddate;
	vm.reportJobs.isCompleted = 'IN_PROGRESS';
	vm.reportJobs.loadOrders();


	vm.getCssClass = function (state) {
		console.log(state);
		return dashboardFactory.getProperWordWithCss(state);
	}
}