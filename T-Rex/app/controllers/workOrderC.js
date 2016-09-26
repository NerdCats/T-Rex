app.controller('workOrderC', ['$scope', '$routeParams', 'ngAuthSettings', 'restCall', 'dashboardFactory', workOrderC]);

function workOrderC($scope, $routeParams, ngAuthSettings, restCall, dashboardFactory){
	var vm = $scope;
	vm.id = $routeParams.id;
	vm.User = {};

	vm.workOrders = dashboardFactory.orders("IN_PROGRESS");
	var asignedJobUrl = ngAuthSettings.apiServiceBaseUri + "api/account/" + vm.id + "/jobs";
}