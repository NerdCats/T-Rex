'use strict'

app.controller('indexController', indexController);

indexController.$inject = ['$scope', '$location', '$timeout', '$log','menus', 'templates', '$window', 'authService'];

function indexController($scope, $location, $timeout, $log, menus, templates, $window, authService) {
	console.log($window.location.hash);
	var vm = $scope;

	vm.sidebarVisible = true;
	vm.shouldShowMenuAndFooter = true;

	vm.menus = menus;
	vm.templates = templates.sidebar;

	

  vm.authData = {};

 
	vm.logout = function () {
		console.log("logout");
		authService.logOut();
		$window.location.reload();
	};


	activate();

	vm.menuShow = function () {
		vm.sidebarVisible = !vm.sidebarVisible;		
	}

	function activate()
	{
		if ($window.location.hash == '#/login'){
			vm.sidebarVisible = false;
			vm.shouldShowMenuAndFooter = false;
		}   
    vm.authData = authService.populateAuthData();
    console.log(vm.authData) 
	}

	 /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
 

}
