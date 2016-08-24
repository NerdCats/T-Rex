'use strict';

app.factory('userService', ["$http", "$window", "restCall", "ngAuthSettings", "odata", userService]);

function userService($http, $window, restCall, ngAuthSettings, odata){

	var users = function (userType) {
		return {
			users: [],
			pagination: null,
			pages: [],
			total: 0,
			isCompleted: '',			
			searchParam: {
				type: "account",
				userType: userType,
				orderby: {
					property: "UserName",
					orderbyCondition: "asc"
				},
				envelope: true,
				page: 0,
				pageSize: 10
			},
			loadUsers: function () {
				this.isCompleted = 'IN_PROGRESS';
				var pageUrl = odata.odataQueryMaker(this.searchParam);
				populateUsers(this, pageUrl);
			}
		}
	}

	var populateUsers = function (Users, usersListUrl) {		
		function successCallback(response) {
			Users.users = [];
			Users.pages = [];
			Users.users = response.data.data;
			Users.isCompleted = 'SUCCESSFULL';
			Users.pagination = response.data.pagination;
			Users.total = response.data.pagination.Total;
			
			for (var i = 0; i < response.data.pagination.TotalPages ; i++) {
				Users.pages.push(i);
			};
			console.log(Users);
		}
		function errorCallback(error) {
			Users.isCompleted = 'FAILED';
			console.log(error);
		}
		restCall('GET', usersListUrl, null, successCallback, errorCallback);
	}

	var populateAssets = function (assets, type, envelope, page, pageSize){	
		var assetlistUrl = ngAuthSettings.apiServiceBaseUri .assets(type, envelope, page, pageSize);
		console.log(assetlistUrl);
		function successCallback (response) {
			assets.Collection = response.data.data;
			for (var i = 0; i < response.data.pagination.TotalPages ; i++) {
				assets.pages.push(i);
			};
		}
		function errorCallback(error) {
			console.log(error);
		}
		restCall('GET', assetlistUrl, null, successCallback, errorCallback);
	};


	var populateUserDetails = function (user, userId) {
		var userUrl = ngAuthSettings.apiServiceBaseUri + "api/account/profile/" + userId;
		function successCallback(response) {
			user = response.data;
			console.log(user);			
		}
		function errorCallback(error) {
			console.log(error)
		}
		restCall('GET', userUrl, null, successCallback, errorCallback);
	}

	var registerNewUser = function (asset){
		var successCallback = function (response) {
  			console.log("success : ");
  			console.log(response);
  			alert("Success")
  			$window.location.href = '#/asset';
  		};
  		
  		var errorCallback = function error(response) {
  			console.log("error : ");
  			console.log(response);
  		};

		console.log(asset);
		var registerNewUserUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/Register";
		restCall('POST', registerNewUserUrl, asset, successCallback, errorCallback)  	
	};

	return {
		users: users,
		populateAssets : populateAssets,
		registerNewUser : registerNewUser,
		populateUsers : populateUsers,
		populateUserDetails : populateUserDetails
	}
}
