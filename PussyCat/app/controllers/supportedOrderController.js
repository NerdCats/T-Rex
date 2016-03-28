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

	vm.update = function (order) {
		console.log(order);
		$window.location.href = "#/supportedOrderUpdate";
	};

	vm.delete = function (id) {		
		console.log(url + "/" + id);
		restCall('DELETE', url + "/" + id, null, function (response) {			
			console.log(response);
			$window.location.reload();
		}, function (error) {
			console.log(error);
		})
	}
}