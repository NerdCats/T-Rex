'use strict';

app.controller('supportedOrderUpdateController', ['$scope', 'FileUploader', supportedOrderUpdateController]);

function supportedOrderUpdateController($scope, FileUploader){
	var vm = $scope;
	vm.supportedOrderUpdate = {
		ActionName : "",
		ActionName: "",
    	OrderName: "",
    	ImageUrl: "",
    	OrderCode: "" 
	};
	vm.uploader = new FileUploader();
	vm.imageUpload = function () {
		var image = document.getElementById('supported-order-image-upload');
		console.log(vm.uploader.queue[0]);
		console.log("modon");
	}
}