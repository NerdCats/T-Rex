'use strict';


var app = angular.module('app', [
	'ngMaterial',
	'ngMessages',
	'ngRoute',
	"ngAnimate",
	'ngAria',
	'LocalStorageModule',
	'md.data.table',
	'angularFileUpload',
	'mdPickers',
	'ngclipboard',
	'SignalR'
]);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/login',{
				templateUrl: 'app/views/login.html',
				controller: 'authController',
				controllerAs: 'auth'
			}).
			when('/',{
				templateUrl: 'app/views/dashboard.html',
		        controller: 'dashBoardController',
		        controllerAs: 'dashboard'
			}).
			when('/order/create',{
				templateUrl: 'app/views/order/create.html',
				controller: 'createOrderController',
				controllerAs: 'createOrder'
			}).
			when('/job/:id',{
				templateUrl: 'app/views/job.html',
				controller: 'jobController',
				controllerAs: 'job'
			}).
			when('/users', {
				templateUrl: 'app/views/users.html',
				controller: 'userController',
				controllerAs: 'users'
			}).
			when('/user/create',{
				templateUrl: 'app/views/user/create.html',
				controller: 'createAssetController',
				controllerAs: 'createAsset'
			}).
			when('/asset', {
				templateUrl: 'app/views/assets.html',
				controller: 'assetController',
				controllerAs: 'assets'
			}).			
			when('/asset/details/:id',{
				templateUrl: 'app/views/user/details.html',
				controller: 'userDetailsController',
				controllerAs: 'user'
			}).
			when('/user/details/:id',{
				templateUrl: 'app/views/user/details.html',
				controller: 'userDetailsController',
				controllerAs: 'user'
			}).
			when('/asset/create',{
				templateUrl: 'app/views/user/create.html',
				controller: 'createAssetController',
				controllerAs: 'createAsset'
			}).
			when('/asset/assets-tracking-map',{
				templateUrl: 'app/views/user/assetsTrackingMap.html',
				controller: 'assetsTrackingMapController',
				controllerAs: 'assetsTrackingMap'
			}).
			when('/supportedOrder',{
				templateUrl: 'app/views/supportedOrders.html',
				controller: 'supportedOrderController',
				controllerAs: 'supportedOrders'
			}).
			when('/supportedOrderCreate',{
				templateUrl: 'app/views/supportedOrder/supportedOrderCreate.html',
				controller: 'supportedOrderCreateController',
				controllerAs: 'supportedOrders'
			}).
			when('/supportedOrderUpdate/:id',{
				templateUrl: 'app/views/supportedOrder/supportedOrderUpdate.html',
				controller: 'supportedOrderUpdateController',
				controllerAs: 'supportedOrders'
			}).
			when('/job-search', {
				templateUrl: 'app/views/job-search.html',
				controller: 'jobSearchController',
				controllerAs: 'jobSearch'
			});

			$routeProvider.otherwise({ redirectTo: "/"});
	}
]);

app.config(function($mdThemingProvider) {
	// Configure a dark theme with primary foreground yellow
	$mdThemingProvider.theme('docs-dark', 'default')
	.primaryPalette('grey')
	.dark();
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptorService');
}]);


app.config(function($locationProvider) {
	$locationProvider.html5Mode(false);
});


