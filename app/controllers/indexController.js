(function () {

	'use strict'

	app.controller('indexController', indexController);

	function indexController($scope, $location, $timeout, $log, menus, templates, $window, authService, jobNotification_link) {	
		var vm = $scope;
		vm.sidebarVisible = true;
		vm.shouldShowMenuAndFooter = true;
		vm.menus = menus;
		vm.templates = templates.sidebar;

		

	  	vm.authData = {};

	 
		vm.logout = function () {		
			authService.logOut();		
		};


		activate();

		vm.menuShow = function () {
			vm.sidebarVisible = !vm.sidebarVisible;		
		}

		vm.saerchJob = function (jobId) {
			$window.open("#/job/" + "Job-" + jobId.toUpperCase(), '_blank');
		}

		function activate()
		{
			if ($window.location.hash == '#/login'){
				vm.sidebarVisible = false;
				vm.shouldShowMenuAndFooter = false;
			}   
		    vm.authData = authService.populateAuthData();    
		}
	}
})();

