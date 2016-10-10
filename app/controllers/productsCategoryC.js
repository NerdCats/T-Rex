app.controller('productsCategoryC', ['$scope', '$http', '$window', 'ngAuthSettings', productsCategoryC])

function productsCategoryC($scope, $http, $window, ngAuthSettings){

	var vm = $scope;
	vm.creatingOrder = false;
	vm.isLoading = false;
	vm.productsCategory = {
		Name: null,
		Description: null
	}
	vm.productsCategories = {};

	vm.createProductsCategory = function () {
		vm.creatingOrder = true;
		$http({
			method: 'POST',
			url: ngAuthSettings.apiServiceBaseUri + "api/ProductCategory",
			data: vm.productsCategory
		}).then(function success(success) {
			vm.getProductsCategory();
			vm.creatingOrder = false;
		}, function error(error) {
			console.log(error);
			vm.creatingOrder = false;
		});
	}


	vm.getProductsCategory = function () {
		vm.isLoading = true;
		$http({
			method: 'GET',
			url: ngAuthSettings.apiServiceBaseUri + "api/ProductCategory/odata",			
		}).then(function success(success) {			
			vm.isLoading = false;
			vm.productsCategories = success.data;
			console.log(success);
		}, function error(error) {
			console.log(error);
			$window.location.href = "#/products-category";
			vm.isLoading = false;
		});
	}
	vm.getProductsCategory();
}