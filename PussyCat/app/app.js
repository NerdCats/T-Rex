'use strict';


var app = angular.module('app', [
  'ngMaterial',
  'ngMessages',
  'ngRoute',
  'LocalStorageModule',
  'md.data.table',
  'angularFileUpload'
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

app.constant('ngAuthSettings', {
  apiServiceBaseUri: "/",
  clientId: 'GoFetchDevWebApp'
});

app.constant('menus', [
	{ Title : "Dashboard", Href: '#/'},
	{ Title : "Orders", Href: '#/'},
	{ Title : "Supported Orders", Href: '#/supportedOrder'},
	{ Title : "Users", Href: '#/'},
	{ Title : "Assets", Href: '#/asset'},
	{ Title : "Agents", Href: '#/'},
	{ Title : "Administration", Href: '#/'}
]);

// app.constant('host', "http://taskcatdev.azurewebsites.net");
app.constant('host', "http://localhost:23873");


app.constant('templates', {
	sidebar: 'app/views/sidebar.html',
	availableAsset: 'app/views/detailsJob/availableAsset.html'
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
