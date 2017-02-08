'use strict';

app.controller('jobController', [ '$scope', '$http', '$interval', '$uibModal','$window', '$routeParams', 'menus', 'templates', 
	'ngAuthSettings', 'timeAgo' , 'jobFactory', 'dashboardFactory', 'mapFactory', 'restCall', 'patchUpdate', 'localStorageService', jobController]);



function jobController($scope, $http, $interval, $uibModal, $window, $routeParams,	menus, 
	templates, ngAuthSettings, timeAgo, jobFactory, dashboardFactory, mapFactory, restCall, patchUpdate, localStorageService) {
	
	var vm = $scope;
	var id = $routeParams.id;	
	vm.selectedStateForFetchAsset = vm.selectedStateForPickup = vm.selectedStateForDelivery = vm.selectedStateForSecuredelivery = 'COMPLETED';
	vm.trackingLink = "fetchprod.gobd.co/#/track/" + id;
	vm.job = jobFactory.job(id);
	vm.job.loadJob();
	vm.job.getComments(id);
	vm.invoiceUrl = function () {
		// var url = ngAuthSettings.apiServiceBaseUri + '/api/job/'+ vm.job.data.HRID +'/invoice';
		var url = 'app/content/invoice/invoice.html?'+ vm.job.data.HRID;
		return url;
	}

	vm.isItbipu = function () {
		var commentDeleter = localStorageService.get("authorizationData");		
		if (commentDeleter.userName === "bipu" ||
			commentDeleter.userName === "sharif" ||
			commentDeleter.userName === "kazi" ||
			commentDeleter.userName === "sakeef" ||
			commentDeleter.userName === "emon" ||
			commentDeleter.userName === "tutul" ||
			commentDeleter.userName === "aasif" ||
			commentDeleter.userName === "qasim" ||
			commentDeleter.userName === "farhan") {
			return true;
		} else return false;
	}

	vm.getAssetsList = function (page) {
		console.log("EnterpriseUsers");
		var getUsersUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/odata?$filter=Type eq 'BIKE_MESSENGER'&$orderby=UserName&page="+ page +"&pageSize=50";
		dashboardFactory.getUserNameList(getUsersUrl).then(function (response) {
			if (page === 0) {
				vm.BikeMessengers = [];				
			}
			angular.forEach(response.data, function (value, index) {
				vm.BikeMessengers.push(value);
			})
			if (response.pagination.TotalPages > page) {
				vm.getAssetsList(page + 1);
			}			
		}, function (error) {
			console.log(error);
			console.log(vm.BikeMessengers)
		});
	}	
	vm.getAssetsList(0);
 
	vm.openCancellationModal = function (size) {
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'app/views/detailsJob/JobCancellation.html',
			controller: 'JobCancellationCtrl'
		});

		modalInstance.result.then(function (reason) {
			vm.cancelReason = reason;
			console.log(reason);
			vm.job.cancel(reason);
		}, function () {
			console.log("discarded")
		})
	}	
};


app.controller('JobCancellationCtrl', ['$scope', '$uibModalInstance', JobCancellationCtrl]);
function JobCancellationCtrl($scope, $uibModalInstance) {
	$scope.reason = "";

	$scope.cancel = function () {
		$uibModalInstance.close($scope.reason);
	}
	$scope.discard = function () {
		$uibModalInstance.dismiss("cancel");
	}
}