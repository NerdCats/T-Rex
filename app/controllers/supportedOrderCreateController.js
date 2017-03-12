(function () {
	
	'use strict';

	app.controller('supportedOrderCreateController', supportedOrderCreateController);

	function supportedOrderCreateController($scope, restCall, FileUploader, $window, supportedOrderFactory){

		var vm = $scope;
		vm.supportedOrder =   {
		    ActionName : "",
		    OrderName : "",
		    ImageUrl : "",
		    OrderCode : ""
	  	};
		vm.uploader = new FileUploader();
	  	vm.uploader.onSuccessItem = function(fileItem, response, status, headers) {                
	        vm.supportedOrder.ImageUrl = response.FileUrl;        
	        $scope.$apply();
	    };

	    vm.imageUpload = function ($event) {	
			$event.preventDefault();
			supportedOrderFactory.imageUpload(vm.supportedOrder.ImageUrl, vm.uploader.queue[0]);		
		};


		vm.registerNewSupportedOrder = function () {
			supportedOrderFactory.register("POST", vm.supportedOrder);		
		};

		supportedOrderFactory.changeImageEvent();
	}
})();