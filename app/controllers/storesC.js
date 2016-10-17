app.controller('storesC', ['$scope', 'storeService', storesC]);

function storesC($scope, storeService){
	var vm = $scope;
	vm.store = storeService.getStore(vm.userid);
	vm.store.loadStores(vm.userid);
}