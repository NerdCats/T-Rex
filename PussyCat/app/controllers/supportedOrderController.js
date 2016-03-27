'use strict';
app.controller('supportedOrderController', ['$scope', 'supportedOrder', 'restCall', '$window', supportedOrderController]);
function supportedOrderController($scope, supportedOrder, restCall, $window){
	var vm = $scope;
	vm.hello = supportedOrder;

	var url = "http://localhost:23873/api/Order/SupportedOrder";
	var successCallback = function (response) {
		vm.supportedOrder = response.data;
		console.log(response);
	};
	var errorCallback = function (error) {
		console.log(error);
	};
	restCall('GET', url, null, successCallback, errorCallback);

	vm.update = function (supportedOrder) {
		$window.location.href = "#/"
	}
}