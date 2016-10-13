app.controller('storeC', ['$scope', '$routeParams', '$uibModal', storeC]);

function storeC($scope, $routeParams, $uibModal){
	var vm = $scope;
	vm.title = "hello store!"
	vm.enterpriseId = $routeParams.id;
	console.log(vm.enterpriseId);

	vm.store = {
				  Name: null,
				  Url: null,
				  DisplayOrder: 0,
				  EnterpriseUserId: vm.enterpriseId,
				  ProductCategories: [
				    
				  ],
				  CoverPicUrl: "string",
				  Id: "string"
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
}


app.controller('categoriesModalC', ['$scope', '$http', '$uibModalInstance', 'ngAuthSettings', 'filterFilter', categoriesModalC]);

function categoriesModalC($scope, $http, $uibModalInstance, ngAuthSettings, filterFilter){
	
	var vm = $scope;

	vm.params = {
		pageSize : 50,
		page: 0,
		envelope: true
	}

    vm.catagories = [];
    vm.selectedCatagory = {};

    vm.loadCatagories = function () {
    	vm.catagoriesUrl = ngAuthSettings.apiServiceBaseUri + 
							"api/ProductCategory/odata?pageSize=" + vm.params.pageSize
														+"&page="+ vm.params.page 
														+"&envelope="+ vm.params.envelope;
		$http({
			method: 'GET',
			url: vm.catagoriesUrl
		}).then(function success(response) {
			vm.catagories = response.data;
		}, function error(error) {
			console.log(error);
		});
    }

	vm.selectCatagorie = function () {
		// body...
	}

	vm.select = function () {
		console.log(vm.selectedCatagory);
		$uibModalInstance.close(vm.selectedCatagory);
	}




}