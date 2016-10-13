app.controller('productsC', ['$scope', productsC]);

function productsC($scope) {
	var vm = $scope;
	vm.title = "Products";
	console.log(vm.title)
}