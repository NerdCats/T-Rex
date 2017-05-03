(function () {

	'use strict';

	app.controller('productsCategoryC', productsCategoryC)

	function productsCategoryC($scope, $http, $window, ngAuthSettings){

		var vm = $scope;
		vm.creatingOrder = false;
		vm.isLoading = false;
		
		vm.updateMode = false;
		vm.productsCategories = {};
		vm.pageSize = 50;
		vm.page = 0;
		vm.envelope = true;
		vm.pagination = [];


		vm.getNewProductsCategory = function () {
			return {
				Name: null,
				Description: null
			}
		}

		vm.productsCategory = vm.getNewProductsCategory();

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

		var populatePagination = function () {
			vm.pagination = [];
			for(var i=0; i<vm.productsCategories.pagination.TotalPages; i++) {
				vm.pagination.push(i)
			}
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
				populatePagination();	
				console.log(vm.productsCategories);
			}, function error(error) {
				console.log(error);
				$window.location.href = "#/products-category";
				vm.isLoading = false;
			});
		}

		vm.updateModeOn = function (productTobeUpdated) {
			vm.updateMode = true;
			vm.productsCategory = productTobeUpdated;
			console.log(productTobeUpdated)
		}

		vm.updateProductsCategory = function () {
			vm.creatingOrder = true;
			$http({
				method: 'PUT',
				url: ngAuthSettings.apiServiceBaseUri + "api/ProductCategory",
				data: vm.productsCategory
			}).then(function success(reponse) {
				vm.creatingOrder = false;
				vm.updateMode = false;
				vm.productsCategory = vm.getNewProductsCategory();
			}, function error(error) {
				vm.creatingOrder = false;
			})
		}


		vm.getProductsCategory();
	}
})();
