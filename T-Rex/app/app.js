'use strict';


var app = angular.module('app', [	
	'ngMessages',
	'ngRoute',
	"ngAnimate",
	'ngAria',
	'LocalStorageModule',
	'ui.bootstrap',	
	'angularFileUpload',	
	'ngclipboard',
	'SignalR',
	'datetimepicker'
]);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/login',{
				templateUrl: 'app/views/login.html',
				controller: 'authController'				
			}).
			when('/',{
				templateUrl: 'app/views/dashboard.html',
		        controller: 'dashBoardController'		        
			}).
			when('/order/create/:id',{
				templateUrl: 'app/views/order/create.html',
				controller: 'createOrderController'				
			}).			
			when('/report', {
				templateUrl: 'app/views/report.html',
				controller: 'reportC'				
			}).
			when('/job/:id',{
				templateUrl: 'app/views/job.html',
				controller: 'jobController',				
			}).
			when('/users', {
				templateUrl: 'app/views/users.html',
				controller: 'userController'				
			}).
			when('/user/create',{
				templateUrl: 'app/views/usercreate.html',
				controller: 'usercreateC'				
			}).
			when('/tracking-map',{
				templateUrl: 'app/views/trackingMap.html',
				controller: 'trackingMapC'				
			}).
			when('/users/:id',{
				templateUrl: 'app/views/userdetails.html',
				controller: 'userDetailsC'				
			})		
			// .
			// when('/asset', {
			// 	templateUrl: 'app/views/assets.html',
			// 	controller: 'assetController'			
			// }).
			// when('/supportedOrder',{
			// 	templateUrl: 'app/views/supportedOrders.html',
			// 	controller: 'supportedOrderController'			
			// }).
			// when('/supportedOrderCreate',{
			// 	templateUrl: 'app/views/supportedOrder/supportedOrderCreate.html',
			// 	controller: 'supportedOrderCreateController'			
			// }).
			// when('/supportedOrderUpdate/:id',{
			// 	templateUrl: 'app/views/supportedOrder/supportedOrderUpdate.html',
			// 	controller: 'supportedOrderUpdateController'			
			// });

			$routeProvider.otherwise({ redirectTo: "/"});
	}
]);

app.config([
    'datetimepickerProvider',
    function (datetimepickerProvider) {
        datetimepickerProvider.setOptions({
            locale: 'en'
        });
    }
]);

// app.config(function($mdThemingProvider) {
// 	// Configure a dark theme with primary foreground yellow
// 	$mdThemingProvider.theme('docs-dark', 'default')
// 	.primaryPalette('grey')
// 	.dark();
// });

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptorService');
}]);


app.config(function($locationProvider) {
	$locationProvider.html5Mode(false);
});


