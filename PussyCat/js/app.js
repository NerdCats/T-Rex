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
				templateUrl: 'partials/dashboard.html',
		        controller: 'indexController'
			}).
			when('/details/:id',{
				templateUrl: 'partials/detailsJob.html',
				controller: 'detailsController'
			}).
			when('/asset', {
				templateUrl: 'partials/assets.html',
				controller: 'assetController'
			}).
			when('/asset/create',{
				templateUrl: 'partials/asset/create.html',
				controller: 'createAssetController'
			})
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