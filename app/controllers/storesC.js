(function () {
	
	'use strict';

	app.controller('storesC', storesC);

	function storesC($scope, storeService){
		var vm = $scope;
		vm.store = storeService.getStore(vm.userid);
		vm.store.loadStores(vm.userid);
	}
})();
