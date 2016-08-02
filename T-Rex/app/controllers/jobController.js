'use strict';

app.controller('jobController', [ '$scope', '$http', '$interval', '$window', '$routeParams', 'menus', 'templates', 'host', 'tracking_host', 'tracking_link', 'timeAgo', 'jobFactory', 'mapFactory', 'restCall', jobController]);



function jobController($scope, $http, $interval, $window, $routeParams,	menus, templates, host, tracking_host, tracking_link, timeAgo,jobFactory, mapFactory, restCall) {
	
	var vm = $scope;
	var id = $routeParams.id;	
	vm.job = jobFactory.job(id);
	vm.job.loadJob();

	
	
	vm.restore = function () {
		console.log(vm.job)
	}

};



