app.controller('storeC', ['$scope', '$routeParams', '$uibModal', '$http', 'ngAuthSettings', storeC]);

function storeC($scope, $routeParams, $uibModal, $http, ngAuthSettings){
	var vm = $scope;
	vm.title = "hello store!"
	vm.enterpriseId = $routeParams.enterpriseuserid;
	vm.creatingStore = false;
	vm.loadingStores = true;
	vm.errmsg = null;
	vm.editingMode = false;
	vm.user = null;
	console.log(vm.enterpriseId);

	vm.getStore = function () {
		return {
				  Name: null,
				  Url: null,
				  DisplayOrder: 0,
				  EnterpriseUserId: vm.enterpriseId,
				  ProductCategories: [
				    
				  ],
				  CoverPicUrl: null			  
			}
	}

	vm.loadUser = function () {
		$http({
			method: 'GET',
			url: ngAuthSettings.apiServiceBaseUri + "api/Account/Profile/" + vm.enterpriseId
		}).then(function (response) {
			vm.user = response.data;
			console.log(response)
		}, function (error) {
			console.log(error);
			vm.errmsg = error.Message;
		})
	}
	vm.loadStores = function () {
		vm.loadingStores = true;
		$http({
			method: 'GET',
			url: ngAuthSettings.apiServiceBaseUri + "api/Store/odata?$filter=EnterpriseUserId eq '" + vm.enterpriseId + "'", //i dont think we will ever need pagination here			
		}).then(function (response) {
			vm.loadingStores = false;
			vm.stores = response.data.data;
			console.log(vm.stores)
		}, function (error) {
			vm.loadingStores = false;
			console.log(error);
		})
	}

	vm.stores = [];
	vm.store = vm.getStore();
	vm.loadUser();
	vm.loadStores();

	vm.editModeOn = function (_store) {
		vm.store = _store;
		vm.editingMode = true;
	}

	vm.editStore = function () {
		$http({
			method: 'PUT',
			url: ngAuthSettings.apiServiceBaseUri + "api/Store",
			data: vm.store
		}).then(function (response) {
			vm.store = vm.getStore();
			vm.editModeOn = false;
			vm.loadStores();
		}, function (error) {
			vm.errmsg = error.Message;
		})
	}

	vm.clearEdit = function () {
		vm.editingMode = false;
		vm.store = vm.getStore();
	}

	vm.deleteStore = function (_store) {
		$http({
			method: 'DELETE',
			url: ngAuthSettings.apiServiceBaseUri + "api/Store/" + _store.Id,			
		}).then(function (response) {			
			vm.loadStores();
		}, function (error) {
			vm.errmsg = error.Message;
		})
	}

	vm.addProductCategories = function () {
		var catagoriesModalInstance = $uibModal.open({
			animation: $scope.animationEnabled,
			templateUrl: 'app/views/modals/addProductCategoris.html',
			controller: 'categoriesModalC'
		});

		catagoriesModalInstance.result.then(function (categories) {			
			vm.store.ProductCategories.push(categories);
		}, function () {
			console.log("discarded");
		})
	}

	vm.removeCategory = function (index) {
		vm.store.ProductCategories.splice(index, 1);
	}

	vm.createStore = function () {
		vm.creatingStore = true;
		vm.errmsg = null;
		$http({
			method: 'POST',
			url: ngAuthSettings.apiServiceBaseUri + "api/Store",
			data: vm.store
		}).then(function (response) {
			vm.store = vm.getStore();
			vm.creatingStore = false;
			vm.loadStores();
		}, function (error) {
			vm.errmsg = error.Message;
			vm.creatingStore = false;
		});
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