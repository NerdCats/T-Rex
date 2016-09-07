'use strict';

app.factory('userService', ["$http", "$window", "restCall", "ngAuthSettings", "queryService", userService]);

function userService($http, $window, restCall, ngAuthSettings, queryService){

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
				var pageUrl;
				if (userType !== "BIKE_MESSENGER") {
					pageUrl = queryService.getOdataQuery(this.searchParam);
				} else {
					pageUrl = "/mockdata/assets.json";
					// pageUrl = queryService.getOdataQuery(this.searchParam);
				}
				populateUsers(this, pageUrl);
			}
		}
	}

	var getNewUser = function () {
		return  {
			data : {
				UserName : "",
				Password : "",
				ConfirmPassword : "",
				Email : "",
				PhoneNumber : "",
				PicUri : "",
				Type : "USER",
				FirstName : "",
				LastName : "",
				Age : 0,
				Gender : "MALE",
				Address : "",      
				NationalId : "",
				DrivingLicenceId : "",
				ContactPersonName : "",
				Website : ""
			},
			status: '',
			loadUser: function (userId) {
				var user = this;
				user.status = 'LOADING_USER';				
				function successCallback(response){
					user.status = '';					
					console.log(response);
				}
				function errorCallback(response){
					user.status = 'LOADING_FAILED';
					console.log(response);
				}
				var userUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/Profile/" + userId;
				restCall('GET', userUrl, null, successCallback, errorCallback);
			},
			register: function () {
				var user = this;
				user.status = 'IN_PROGRESS';
				var successCallback = function (response) {		  			
		  			user.status = 'SUCCESSFULL';		  			
		  			console.log(response);
		  			$window.location.href = '#/users';
		  		};
		  		
		  		var errorCallback = function error(response) {		  			
		  			user.status = 'FAILED';		  			
		  			console.log(response);
		  		};
				var registerNewUserUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/Register";
				restCall('POST', registerNewUserUrl, this.data, successCallback, errorCallback)  	
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

	return {
		users: users,
		getNewUser: getNewUser,			
		populateUserDetails : populateUserDetails
	}
}
