app.controller('storeC', ['$scope', '$routeParams', '$uibModal', '$http', 'storeService', storeC]);

function storeC($scope, $routeParams, $uibModal, $http, storeService){
	var vm = $scope;
	vm.userid = $routeParams.userid;
	vm.username = $routeParams.username;

	vm.store = storeService.getStore(vm.userid);
	console.log(vm.store);
	vm.store.singleStore = vm.store.getNewStore();
	vm.store.loadStores(vm.userid);

	vm.addProductCategories = function () {
		var catagoriesModalInstance = $uibModal.open({
			animation: $scope.animationEnabled,
			templateUrl: 'app/views/modals/addProductCategoriesForStore.html',
			controller: 'categoriesModalC'
		});

		catagoriesModalInstance.result.then(function (categories) {		
			vm.store.singleStore.ProductCategories.push(categories);
		}, function () {
			console.log("discarded");
		})
	}
}


app.controller('categoriesModalC', ['$scope', '$http', '$uibModalInstance', 'ngAuthSettings', categoriesModalC]);

function categoriesModalC($scope, $http, $uibModalInstance, ngAuthSettings){

	var vm = $scope;

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
    	vm.catagoriesUrl = ngAuthSettings.apiServiceBaseUri + 
							"api/ProductCategory/odata?pageSize=" + vm.params.pageSize
														+"&page="+ vm.params.page
														+"&envelope="+ vm.params.envelope;
		$http({
			method: 'GET',
			url: vm.catagoriesUrl
		}).then(function success(response) {
			vm.isLoadingCategories = false;
			vm.catagories = response.data.data;
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