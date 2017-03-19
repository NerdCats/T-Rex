(function () {
	'use strict';

	app.controller('settingsC', settingsC);

	function settingsC($scope, $http, ngAuthSettings, localStorageService) {
		
		var vm = $scope;
		vm.authorizationData = localStorageService.get('authorizationData');
		var decoded_token = jwt_decode(vm.authorizationData.token);
		vm.loggedInUserName = decoded_token.unique_name;

		if (decoded_token.role.constructor === Array) {
			vm.Roles = decoded_token.role;
		} else {
			vm.Roles = [decoded_token.role];
		}

		

		vm.expirationtime = new Date(decoded_token.exp * 1000);
		vm.userId = decoded_token.nameid;
		vm.userProfile = {};
		vm.errMessage = null;
		vm.successMessage = null;
		vm.newUserName = { UserName : null };

		vm.passwordUpdate = {
			CurrentPassword : null,
			NewPassword: null,
			ConfirmPassword: null
		}

		vm.contacts = {			
			  Email: null,
			  PhoneNumber: null			
		}

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

		vm.updatePassword = function () {
			$http({
				method: 'PUT',
				url: ngAuthSettings.apiServiceBaseUri + "api/Account/password",
				data: vm.passwordUpdate
			}).then(function (response) {
				if (response.data.Succeeded) {
					vm.successMessage = "Password successfully updated!";
					vm.errMessage = null;
					vm.passwordUpdate = {
						CurrentPassword : null,
						NewPassword: null,
						ConfirmPassword: null
					}
				} else {
					vm.errMessage = "Couldn't update password. ";
					vm.successMessage = null;
					angular.forEach(response.data.Errors, function (value, key) {
						vm.errMessage += "\n " + value;
					});
				}
			}, function (err) {
				vm.errMessage = "Couldn't update password!";
			})
		}

		vm.updateUserName = function () {
			console.log(vm.newUserName);
			$http({
				method: 'PUT',
				url: ngAuthSettings.apiServiceBaseUri + "api/Account/username/" + vm.userId + "?newUsername=" + vm.newUserName.UserName
			}).then(function (response) {
				if (response.data.Succeeded) {
					vm.successMessage = "UserName updated successfully! Next time, during login, use the new UserName!"
					vm.errMessage = null;
					vm.newUserName = null;
				} else {
					vm.errMessage = "Couldn't update UserName. ";
					vm.successMessage = null;
					angular.forEach(response.data.Errors, function (value, key) {
						vm.errMessage += "\n " + value;
					});
				}
			}, function () {
				vm.errMessage = "Couldn't update the UserName!";
				vm.successMessage = null;
				vm.newUserName = null;
			})
		}

		vm.updateContact = function () {
			$http({
				method: 'PUT',
				url: ngAuthSettings.apiServiceBaseUri + "api/Account/contacts",
				data: vm.contacts
			}).then(function (response) {
				if (response.data.Succeeded) {
					vm.successMessage = "PhoneNumber/Email updated successfully!";
					vm.errMessage = null;					
					vm.contacts = {			
						  Email: null,
						  PhoneNumber: null			
					}
				} else {
					vm.errMessage = "Couldn't update UserName. ";
					vm.successMessage = null;
					angular.forEach(response.data.Errors, function (value, key) {
						vm.errMessage += "\n " + value;
					});
				}
				
								
			}, function () {
				vm.errMessage = "Couldn't update the PhoneNumber/ Email!";
				vm.successMessage = null;
			})
		}

		vm.loadProfile();
	}

})();