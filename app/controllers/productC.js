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
			templateUrl: 'app/views/modals/addProductCategoris.html',
			controller: 'categoriesModalC'
		});

		catagoriesModalInstance.result.then(function (category) {
			vm.product.addCatagory(category);			
		}, function () {
			console.log("discarded");
		})
	}
}