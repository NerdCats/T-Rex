(function () {
	
	app.directive('overallStatus', overallStatus);

	function overallStatus(){

		var overallStatusController = ['$scope', '$http', 'ngAuthSettings', function ($scope, $http, ngAuthSettings) {
			var vm = $scope;

			vm.today = new Date();
			var startDate = new Date(vm.today.getFullYear(), vm.today.getMonth(), vm.today.getDate(), 0, 0, 0).toISOString();
			var endDate = new Date(vm.today.getFullYear(), vm.today.getMonth(), vm.today.getDate(), 23, 59, 59).toISOString();

			var dateRangeQuery = "ModifiedTime gt datetime'"+ startDate +"' and ModifiedTime lt datetime'"+ endDate +"'";
			vm.baseUrl = ngAuthSettings.apiServiceBaseUri + "api/job/odata?$filter=" + dateRangeQuery + " and ";


			// vm.B2BTotalDispatchedUrl = vm.baseUrl + "User/UserName ne 'B2C' and Tasks/any(task: task/State eq 'IN_PROGRESS' and task/Type eq 'Delivery' and task/Variant eq 'default')&countOnly=true"
			// vm.B2CTotalDispatchedUrl = vm.baseUrl + ""

			vm.B2BTotalCompletedUrl = vm.baseUrl + "User/UserName ne 'B2C' and Tasks/any(task: task/State eq 'COMPLETED' and task/Type eq 'Delivery')&countOnly=true";
			vm.B2CTotalCompletedUrl = vm.baseUrl + "User/UserName eq 'B2C' and Tasks/any(task: task/State eq 'COMPLETED' and task/Type eq 'Delivery')&countOnly=true";
			
			vm.B2BTotalAttemptedUrl = vm.baseUrl + "User/UserName ne 'B2C' and Tasks/any(task: task/State eq 'IN_PROGRESS' and task/Variant eq 'retry' and task/Type eq 'Delivery')&countOnly=true";
			vm.B2CTotalAttemptedUrl = vm.baseUrl + "User/UserName eq 'B2C' and Tasks/any(task: task/State eq 'IN_PROGRESS' and task/Variant eq 'retry' and task/Type eq 'Delivery')&countOnly=true";
			
			vm.B2BTotalReturnedUrl = vm.baseUrl + "User/UserName ne 'B2C' and Tasks/any(task: task/State eq 'IN_PROGRESS' and task/Variant eq 'return' and task/Type eq 'Delivery')&countOnly=true";		
			vm.B2CTotalReturnedUrl = vm.baseUrl + "User/UserName eq 'B2C' and Tasks/any(task: task/State eq 'IN_PROGRESS' and task/Variant eq 'return' and task/Type eq 'Delivery')&countOnly=true";

			vm.BikroyPickupUrl = vm.baseUrl + "User/UserName eq 'Bikroy' and Tasks/any(task: task/State eq 'COMPLETED' and task/Type eq 'PackagePickup')&countOnly=true";

			vm.B2BTotalDispatch = NaN;
			vm.B2CTotalDispatch = NaN;
			vm.B2BTotalCompleted = NaN;
			vm.B2CTotalCompleted = NaN;
			vm.B2BTotalAttempted = NaN;
			vm.B2CTotalAttempted = NaN;
			vm.B2BTotalReturned = NaN;
			vm.B2CTotalReturned = NaN;
			vm.BikroyPickup = NaN;
			
			vm.overallStatusDropdownClass = 'overall-status-inactive';

			vm.toggleDropdown = function () {
				if (vm.overallStatusDropdownClass) {
					vm.overallStatusDropdownClass = '';
					vm.LoadJobCount();
				} else {
					vm.overallStatusDropdownClass = 'overall-status-inactive';
				}				
			}

			vm.LoadJobCount = function () {				
				// B2B Total Completed
				$http({
					method: 'GET',
					url: vm.B2BTotalCompletedUrl
				}).then(function (response) {
					if (response.data.pagination.Total) {
						vm.B2BTotalCompleted = response.data.pagination.Total;
					} else {
						vm.B2BTotalCompleted = 0;
					}
					
				}, function (error) {
					console.log(vm.B2BTotalCompletedUrl);
				});


				// B2C Total Completed
				$http({
					method: 'GET',
					url: vm.B2CTotalCompletedUrl
				}).then(function (response) {
					if (response.data.pagination.Total) {
						vm.B2CTotalCompleted = response.data.pagination.Total;
					} else {
						vm.B2CTotalCompleted = 0;
					}
					
				}, function (error) {
					console.log(vm.B2CTotalCompletedUrl);
				});


				// B2B Total Attempted
				$http({
					method: 'GET',
					url: vm.B2BTotalAttemptedUrl
				}).then(function (response) {
					if (response.data.pagination.Total) {
						vm.B2BTotalAttempted = response.data.pagination.Total;
					} else {
						vm.B2BTotalAttempted = 0;
					}
					
				}, function (error) {
					console.log(vm.B2BTotalAttemptedUrl);
				});


				// B2C Total Attempted
				$http({
					method: 'GET',
					url: vm.B2CTotalAttemptedUrl
				}).then(function (response) {
					if (response.data.pagination.Total) {
						vm.B2CTotalAttempted = response.data.pagination.Total;
					} else {
						vm.B2CTotalAttempted = 0;
					}
					
				}, function (error) {
					console.log(vm.B2CTotalAttemptedUrl);
				});


				// B2B Total Returned
				$http({
					method: 'GET',
					url: vm.B2BTotalReturnedUrl
				}).then(function (response) {
					if (response.data.pagination.Total) {
						vm.B2BTotalReturned = response.data.pagination.Total;
					} else {
						vm.B2BTotalReturned = 0;
					}
					
				}, function (error) {
					console.log(vm.B2BTotalReturnedUrl);
				});


				// B2C Total Returned
				$http({
					method: 'GET',
					url: vm.B2CTotalReturnedUrl
				}).then(function (response) {
					if (response.data.pagination.Total) {
						vm.B2CTotalReturned = response.data.pagination.Total;
					} else {
						vm.B2CTotalReturned = 0;
					}
					
				}, function (error) {
					console.log(vm.B2CTotalReturnedUrl);
				});


				// Bikroy Pickup
				$http({
					method: 'GET',
					url: vm.BikroyPickupUrl
				}).then(function (response) {
					if (response.data.pagination.Total) {
						vm.BikroyPickup = response.data.pagination.Total;
					} else {
						vm.BikroyPickup = 0;
					}
					
				}, function (error) {
					console.log(vm.BikroyPickupUrl);
				});
			}		
		}];

		return {		
			controller: overallStatusController,		
			restrict: 'E',
			templateUrl: '../app/directives/OverallStatus/overallStatus.html'
		}
	}
})();