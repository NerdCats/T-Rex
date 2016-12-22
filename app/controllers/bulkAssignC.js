app.controller('bulkAssignC', bulkAssignC);

function bulkAssignC($scope, dashboardFactory){
	var vm = $scope;
	vm.listOfHRID = [];
	vm.Orders = dashboardFactory.orders(null);	
	vm.$watch(function () {
		return vm.listOfHRID;
	}, function (newVal, oldVal) {
		if (newVal != oldVal) {
			vm.Orders.loadListOfOrders(newVal);
		}
	})
}