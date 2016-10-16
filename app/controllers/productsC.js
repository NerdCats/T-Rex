app.controller('productsC', ['$scope', '$routeParams', '$window', '$http', 'ngAuthSettings', 'productServices', productsC]);

function productsC($scope, $routeParams, $window, $http, ngAuthSettings, productServices) {
	var vm = $scope;
	vm.storename = $routeParams.storename;
	vm.storeid = $routeParams.storeid;
	vm.products = productServices.getProducts();

	if (!vm.storeid) {
		$window.history.back();
		// TODO: when you get time, put up a modal explaining why we are going back to previous page!
	}

 
}