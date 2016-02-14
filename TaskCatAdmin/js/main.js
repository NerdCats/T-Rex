var app = angular.module('fetch_dashboard', ['ngMaterial','ngMessages']);

app.factory('menus', function($window) {
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

app.factory('templates', function() {
	var templates = [ 
	 	{ name: 'sidebar.html', url: 'template/sidebar.html'},
      	{ name: 'template2.html', url: 'template2.html'} 
    ];

    return templates;
});



app.config(function($locationProvider) {
	$locationProvider.html5Mode(true);
});