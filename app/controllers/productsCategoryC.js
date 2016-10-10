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
	vm.pageSize = 50;
	vm.page = 0;
	vm.envelope = true;
	vm.pagination = [];

	vm.loadByPageNumber = function (pageSize) {
		vm.pageSize = pageSize;
		vm.getProductsCategory();
	}

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
			url: ngAuthSettings.apiServiceBaseUri + "api/ProductCategory/odata?pageSize="+ vm.pageSize 
																			+"&page="+ vm.page 
																			+"&envelope="+ vm.envelope		
		}).then(function success(success) {			
			vm.isLoading = false;
			vm.productsCategories = success.data;			
			for(var i=0; i<vm.productsCategories.pagination.TotalPages; i++) {
				vm.pagination.push(i)
			}

			console.log(vm.productsCategories);
		}, function error(error) {
			console.log(error);
			$window.location.href = "#/products-category";
			vm.isLoading = false;
		});
	}
	vm.getProductsCategory();
}