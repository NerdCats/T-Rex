app.controller('storeC', ['$scope', '$routeParams', storeC]);

function storeC($scope, $routeParams){
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
		
	}
}