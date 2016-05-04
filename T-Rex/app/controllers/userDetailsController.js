app.controller('userDetailsController', ['$scope', '$routeParams', 'userService', 'host', 'restCall', function($scope, $routeParams, userService, host, restCall){
	
	var vm = this;
	var id = $routeParams.id;
	vm.User = {};
	vm.isAsset = false;
	vm.isEnterprise = false;
	vm.isUser = false;


	var userUrl = host + "api/account/profile/" + id;

	function userFound(response) {
		vm.User = response.data;
		if (vm.User.Type == "USER") 
			vm.isUser = true;
		else if (vm.User.Type == "BIKE_MESSENGER" || vm.User.Type == "CNG_DRIVER")
			vm.isAsset = true;
		else if (vm.User.Type == "ENTERPRISE") 
			vm.isEnterprise = true;

		console.log(vm.User.Type);
		console.log(vm.isUser);
	}
	function userNotFound(error) {
		console.log(error)
	}
	restCall('GET', userUrl, null, userFound, userNotFound);


	var asignedJobUrl = host + "api/account/"+id+"/jobs";
	function jobsFound(response) {
		vm.UsersJobs = response.data;
		console.log(vm.UsersJobs);
	}
	function jobsNotFound(error) {
		console.log(error)
	}
	restCall('GET', asignedJobUrl, null, jobsFound, jobsNotFound);
	
}]);