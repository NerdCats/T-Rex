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
	vm.imageUpload = function ($event) {	
		$event.preventDefault();
		console.log(vm.uploader)
	}

	//need to show the selected image on browser, will come back to it later
	function readURL(input) {
	    if (input.files && input.files[0]) {
	        var reader = new FileReader();

	        reader.onload = function (e) {
	            $('#selected-image').attr('src', e.target.result);
	        }

	        reader.readAsDataURL(input.files[0]);
	    }
	}

	$("#image-upload-input").change(function(){
	    readURL(this);
	});
}