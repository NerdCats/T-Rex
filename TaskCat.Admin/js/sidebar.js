'use strict';

app.controller('sidebarController', function ($scope, $http, $interval, $mdDialog, $mdMedia,$window,menus, templates) {

	$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
	//menu options
	$scope.menus = menus;
	$scope.templates = templates;
});