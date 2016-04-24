'use strict';


var app = angular.module('app', [
  'ngMaterial',
  'ngMessages',
  'ngRoute',
  'LocalStorageModule',
  'md.data.table',
  'angularFileUpload',
  // 'material.svgAssetsCache',
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
			when('/details/:id',{
				templateUrl: 'app/views/detailsJob.html',
				controller: 'detailsController',
				controllerAs: 'details'
			}).
			when('/asset', {
				templateUrl: 'app/views/assets.html',
				controller: 'assetController',
				controllerAs: 'assets'
			}).
			when('/asset/create',{
				templateUrl: 'app/views/asset/create.html',
				controller: 'createAssetController',
				controllerAs: 'createAsset'
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


