'use strict';


var app = angular.module('app', [
	'ngMaterial',
	'ngMessages',
	'ngRoute'
]);

angular.module('app').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/',{	
				templateUrl: 'app/views/dashboard.html',
		        controller: 'dashBoardController',
		        controllerAs: 'dashboard'
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
			})
			$routeProvider.otherwise({ redirectTo: "/"});
	}
]);

angular.module('app').config(function($mdThemingProvider) {
	// Configure a dark theme with primary foreground yellow
	$mdThemingProvider.theme('docs-dark', 'default')
	.primaryPalette('grey')
	.dark();
});

// app.config(function($locationProvider) {
// 	$locationProvider.html5Mode(true);
// });

// app.config(function($locationProvider) {
// 	$locationProvider.html5Mode(false);
// });
