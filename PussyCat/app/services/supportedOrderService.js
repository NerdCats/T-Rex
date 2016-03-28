app.factory('supportedOrderFactory', ['$http', 'restCall', '$window', function($http, restCall, $window){

	var imageUpload = function (ImageUrl, uploader) {	
		ImageUrl = "http://www.arabianbusiness.com/skins/ab.main/gfx/loading_spinner.gif";		
		uploader.alias = "image";
		uploader.url = "http://localhost:23873/api/Storage/image";
		uploader.upload();		
	};

	var register = function (method, order) {
		var successCallback = function (response) {
			console.log(response);
			alert("success");
			$window.location.href = '#/supportedOrder';
		};
		var errorCallaback = function (error) {
			console.log(error);
		};
		restCall(method, "http://localhost:23873/api/Order/SupportedOrder", order, successCallback, errorCallaback);
	};

	var changeImageEvent = function () {
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
	};
	return {
		imageUpload : imageUpload,
		register : register,
		changeImageEvent : changeImageEvent
	};
}]);