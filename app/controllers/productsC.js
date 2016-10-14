app.controller('productsC', ['$scope', '$routeParams', '$window', productsC]);

function productsC($scope, $routeParams, $window) {
	var vm = $scope;
	vm.title = "productsC";
	vm.storename = $routeParams.storename;
	vm.storeid = $routeParams.storeid;
}