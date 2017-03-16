(function () {
	'use strict';

	app.controller('settingsC', settingsC);

	function settingsC($scope, $http, ngAuthSettings, localStorageService) {
		
		var vm = $scope;
		vm.authorizationData = localStorageService.get('authorizationData');
		var decoded_token = jwt_decode(vm.authorizationData.token);
		vm.loggedInUserName = decoded_token.unique_name;
		vm.role = decoded_token.role;
		vm.expirationtime = new Date(decoded_token.exp * 1000);
		vm.userId = decoded_token.nameid;
		vm.userProfile = {};
		vm.errMessage = null;
		vm.successMessage = null;

		vm.loadProfile = function () {
			$http({
				method: 'GET',
				url: ngAuthSettings.apiServiceBaseUri + "api/Account/Profile/" + vm.userId
			}).then(function (response) {
				vm.userProfile = response.data;
			}, function (error) {
				vm.errMessage = "Server error! Couldn't load profile.";
			});
		}

		vm.changePassword = function () {
			$http({
				method: 'PUT',
				url: ngAuthSettings.apiServiceBaseUri + "api/Account/password",
				data: {
						"CurrentPassword": vm.currentPassword,
						"NewPassword": vm.newPassword,
						"ConfirmPassword": vm.confirmPassword
					}
			}).then(function (response) {
				vm.successMessage = "Password successfully updated!";
			}, function (err) {
				vm.errMessage = "Couldn't update password!";
			})
		}

		vm.loadProfile();


		// aud:"GoFetchDevWebApp"
		// email:"tareq@gmail.com"
		// exp:1489816344
		// given_name:"Muhammed Tareq Aziz Aziz"
		// http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authenticatio"true"
		// iss:"TaskCat.Auth"
		// nameid:"587b437862eb2f30c0a97494"
		// nbf:1489643544
		// role:"Administrator"
		// sub:"tareq"
		// unique_name:"tareq"
	}

})();