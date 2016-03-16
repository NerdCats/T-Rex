'use strict';


var app = angular.module('app', [
  'ngMaterial',
  'ngMessages',
  'ngRoute',
  'LocalStorageModule'
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
			})
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
  apiServiceBaseUri: "http://localhost:23873/",
  clientId: 'GoFetchDevWebApp'
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptorService');
}]);


// app.config(function($locationProvider) {
// 	$locationProvider.html5Mode(true);
// });

// app.config(function($locationProvider) {
// 	$locationProvider.html5Mode(false);
// });
