var app = angular.module('fetch_dashboard', ['ngMaterial','ngMessages']);
angular.module('fetch_dashboard').factory('menus', function($window) {
	//menu options
	var menus = [
		{Title : "Dashboard",  Navigate: function(){$window.location.href = '/index.html'}},
		{Title : "Orders",  Navigate: function(){$window.location.href = '/index.html'}},
		{Title : "Users",  Navigate: function(){$window.location.href = '/index.html'}},
		{Title : "Assets",  Navigate: function(){$window.location.href = '/asset.html'}},
		{Title : "Agents",  Navigate: function(){$window.location.href = '/index.html'}},
		{Title : "Administration",  Navigate: function(){$window.location.href = '/index.html'}}
	];

	return menus;
});

app.config(function($locationProvider) {
	$locationProvider.html5Mode(true);
});