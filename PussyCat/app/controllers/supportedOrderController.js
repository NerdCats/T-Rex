'use strict';
app.controller('supportedOrderController', ['$scope', 'supportedOrder', supportedOrderController]);
function supportedOrderController($scope, supportedOrder){
	var vm = $scope;
	vm.hello = supportedOrder;
	console.log(supportedOrder);
	console.log(vm.hello);
}