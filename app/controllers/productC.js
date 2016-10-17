app.controller('productC', ['$scope', '$routeParams', '$window', '$uibModal', 'productServices', productC]);

function productC($scope, $routeParams, $window, $uibModal, productServices) {
	var vm = $scope;
	vm.storename = $routeParams.storename;
	vm.storeid = $routeParams.storeid;
	vm.productid = $routeParams.productid;


	vm.product = productServices.getProduct();
	if (!vm.storeid) {
		$window.history.back();
		// TODO: when you get time, put up a modal explaining why we are going back to previous page!
	}
	if (vm.productid) {
		vm.product.updateMode = true;
		vm.product.loadProduct(vm.productid);
		console.log(vm.productid)
	}

	vm.product.data.StoreId = vm.storeid;

	vm.addProductCategory = function () {
		var catagoriesModalInstance = $uibModal.open({
			animation: $scope.animationEnabled,
			templateUrl: 'app/views/modals/addProductCatagoriesForProduct.html',
			controller: 'storeCategoriesModalC'
		});

		catagoriesModalInstance.result.then(function (category) {
			vm.product.addCatagory(category);			
		}, function () {
			console.log("discarded");
		})
	}
}


app.controller('storeCategoriesModalC', ['$scope', '$http', '$routeParams', '$window', '$uibModalInstance', 'ngAuthSettings', storeCategoriesModalC]);

function storeCategoriesModalC($scope, $http, $routeParams, $window, $uibModalInstance, ngAuthSettings){

	var vm = $scope;
	vm.storeid = $routeParams.storeid;
	vm.storename = $routeParams.storename;
	vm.params = {
		pageSize : 50,
		page: 0,
		envelope: true
	}

    vm.catagories = [];
    vm.selectedCatagory = {};
    vm.isLoadingCategories = true;
    vm.searchText = "";

    vm.loadCatagories = function () {
    	vm.catagoriesUrl = ngAuthSettings.apiServiceBaseUri + "/api/Store/" + vm.storeid;
		$http({
			method: 'GET',
			url: vm.catagoriesUrl
		}).then(function success(response) {
			vm.isLoadingCategories = false;
			vm.catagories = response.data.ProductCategories;
			console.log(vm.catagories)
		}, function error(error) {
			vm.isLoadingCategories = false;
			console.log(error);
		});
    }

	vm.selectCatagorie = function (cat) {
		vm.selectedCatagory = cat;
	}

	vm.select = function () {		
		$uibModalInstance.close(vm.selectedCatagory);
	}

	vm.loadCatagories();
}