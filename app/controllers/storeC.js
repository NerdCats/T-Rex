app.controller('storeC', ['$scope', '$routeParams', storeC]);

function storeC($scope, $routeParams){
	var vm = $scope;
	vm.title = "hello store!"
	vm.enterpriseId = $routeParams.id;
	console.log(vm.enterpriseId);
}