app.service('reportService', ['$http', '$window', '$interval', 'timeAgo', 'restCall', 'queryService', 'ngAuthSettings', reportService]);

function reportService($http, $window, $interval, timeAgo, restCall, queryService, ngAuthSettings){
	
	vm = $scope;
	vm.EnterpriseUsers = [];
	var getReport = function () {
		dashboardFactory.getUserNameList("ENTERPRISE", vm.EnterpriseUsers);
	}

	return {
		getReport: getReport
	}
}
