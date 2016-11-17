'use strict'

app.controller('indexController', indexController);

indexController.$inject = ['$scope', '$location', '$timeout', '$log','menus', 'templates', '$window', 'authService', 'jobNotification_link'];

function indexController($scope, $location, $timeout, $log, menus, templates, $window, authService, jobNotification_link) {
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


 	var connection = $.hubConnection(jobNotification_link);
	var proxy = connection.createHubProxy('broadcaster');
	 
	// receives broadcast messages from a hub function, called "broadcastMessage"
	proxy.on('UpdateJobStatus', function(JobStatus) {   
		console.log(JobStatus);
		
	});

	// atempt connection, and handle errors
	connection.start()
	.done(function(){ 
		console.log('Now connected, connection ID=' + connection.id);
		console.log(connection);
		console.log(proxy);
	})
	.fail(function(){ 
		console.log('Could not connect'); });

}
