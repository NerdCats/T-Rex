app.controller('productsC', ['$scope', '$routeParams', '$window', productsC]);

function productsC($scope, $routeParams, $window) {
	var vm = $scope;
	vm.title = "productsC";
	vm.storename = $routeParams.storename;
	vm.storeid = $routeParams.storeid;

	if (!vm.storeid) {
		$window.history.back();
		// TODO: when you get time, put up a modal explaining why we are going back to previous page!
	}
}