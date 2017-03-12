(function () {
	
	'use strict';

	app.controller('supportedOrderController', supportedOrderController);

	function supportedOrderController($scope, supportedOrderFactory, restCall, host, $window){
		var vm = $scope;	

		var supportedOrderUrl = host + "api/Order/SupportedOrder";
		var successCallback = function (response) {
			vm.supportedOrder = response.data;
			console.log(response);
		};
		var errorCallback = function (error) {
			console.log(error);
		};
		restCall('GET', supportedOrderUrl, null, successCallback, errorCallback);

		vm.update = function (order) {
			console.log(order);
			$window.location.href = "#/supportedOrderUpdate";
		};

		vm.delete = function (id) {		
			console.log(supportedOrderUrl + "/" + id);
			restCall('DELETE', supportedOrderUrl + "/" + id, null, function (response) {			
				console.log(response);
				$window.location.reload();
			}, function (error) {
				console.log(error);
			})
		}
	}
})();
