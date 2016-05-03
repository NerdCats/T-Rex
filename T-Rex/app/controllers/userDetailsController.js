app.controller('userDetailsController', ['$scope', '$routeParams', 'userService', 'host', 'restCall', function($scope, $routeParams, userService, host, restCall){
	var vm = this;
	var id = $routeParams.id;
	vm.User = {};
	
	var userUrl = host + "api/account/profile/" + id;
	function successCallback(response) {
		vm.User = response.data;
		console.log(vm.User);
	}
	function errorCallback(error) {
		console.log(error)
	}
	restCall('GET', userUrl, null, successCallback, errorCallback);

}]);