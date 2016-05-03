app.controller('userDetailsController', ['$scope', '$routeParams', 'userService', 'host', 'restCall', function($scope, $routeParams, userService, host, restCall){
	var vm = this;
	var id = $routeParams.id;
	vm.User = {};
	
	var userUrl = host + "api/account/profile/" + id;
	function userFound(response) {
		vm.User = response.data;
		console.log(vm.User);
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