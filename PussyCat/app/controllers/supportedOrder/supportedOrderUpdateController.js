'use strict';

app.controller('supportedOrderUpdateController', ['$scope', '$window', '$routeParams', 'FileUploader', 'restCall', supportedOrderUpdateController]);

function supportedOrderUpdateController($scope, $window, $routeParams, FileUploader, restCall){
	var vm = $scope;
	var id = $routeParams.id;
	restCall("GET", "http://localhost:23873/api/Order/SupportedOrder/"+id, null, function (response) {
		vm.supportedOrder = response.data;		
	}, function (error) {
		console.log(error);
	});

	// vm.imageSrc = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
	vm.uploader = new FileUploader();
	vm.uploader.onSuccessItem = function(fileItem, response, status, headers) {                
        vm.supportedOrder.ImageUrl = response.FileUrl;        
        $scope.$apply();
    };
	
	vm.imageUpload = function ($event) {	
		$event.preventDefault();
		vm.supportedOrder.ImageUrl = "http://www.arabianbusiness.com/skins/ab.main/gfx/loading_spinner.gif";		
		vm.uploader.queue[0].alias = "image";
		vm.uploader.queue[0].url = "http://localhost:23873/api/Storage/image";
		vm.uploader.queue[0].upload();	
	};

	vm.registerNewSupportedOrder = function () {
		var successCallback = function (response) {
			console.log(response);
			alert("success");
			$window.location.href = '#/supportedOrder';
		};
		var errorCallaback = function (error) {
			console.log(error);
		};
		restCall("PUT", "http://localhost:23873/api/Order/SupportedOrder", vm.supportedOrder, successCallback, errorCallaback);
	};


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