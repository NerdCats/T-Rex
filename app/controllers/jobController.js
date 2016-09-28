'use strict';

app.controller('jobController', [ '$scope', '$http', '$interval', '$uibModal','$window', '$routeParams', 'menus', 'templates', 
	'ngAuthSettings', 'timeAgo' , 'jobFactory', 'mapFactory', 'restCall', 'patchUpdate', jobController]);



function jobController($scope, $http, $interval, $uibModal, $window, $routeParams,	menus, 
	templates, ngAuthSettings, timeAgo, jobFactory, mapFactory, restCall, patchUpdate) {
	
	var vm = $scope;
	var id = $routeParams.id;	
	vm.trackingLink = "gofetch.cloudapp.net:8000/#/track/" + id;
	vm.job = jobFactory.job(id);
	vm.job.loadJob();
	vm.invoiceUrl = function () {
		// var url = ngAuthSettings.apiServiceBaseUri + '/api/job/'+ vm.job.data.HRID +'/invoice';
		var url = 'app/content/invoice/invoice.html?'+ vm.job.data.HRID;
		return url;
	}
	
 
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

	vm.openAssetsList = function (size) {
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'app/views/detailsJob/availableAsset.html',
			controller: 'ModalInstanceCtrl'
		});

		modalInstance.result.then(function (selectedItem) {
				vm.selected = selectedItem;
				console.log($scope.selected);
				vm.job.assigningAsset(true);
				var success = function (response) {
					vm.job.assigningAsset(false);					
		  			$window.location.reload();	  			
				};
				var error = function (error) {
		  			console.log(error);
		  			vm.job.redMessage = error;
		  			vm.job.assigningAsset(false);
				};

				var url = ngAuthSettings.apiServiceBaseUri + "api/job/" + vm.job.data.Id + "/" + vm.job.data.Tasks[0].id;
				var assetRefUpdateData = [{value: vm.selected.Id, path: "/AssetRef",op: "replace"}];
				// var result = patchUpdate(vm.selected.Id, "replace", 
				// 						"/AssetRef", "api/job/", 
				// 						vm.job.data.Id, vm.job.data.Tasks[0].id, 
				// 						success, error);
				var result = restCall("PATCH", url, assetRefUpdateData, success, error);
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
		};
};


app.controller('ModalInstanceCtrl', ['$scope', '$http', '$uibModalInstance', 'ngAuthSettings', ModalInstanceCtrl]);
function ModalInstanceCtrl($scope, $http, $uibModalInstance, ngAuthSettings) {
	
	$scope.assets = [];
	$scope.loadingAssets = true;
	var assetListUrlMaker = function (type, envelope, page, pageSize) {
		var parameters =  "$filter=Type eq 'BIKE_MESSENGER'" + "&envelope=" + envelope + "&page=" + page + "&pageSize=" + pageSize;		
		var assetListUrl = ngAuthSettings.apiServiceBaseUri + "/api/Account/odata?" + parameters;		
		return assetListUrl;
	};

	// var url1 = assetListUrlMaker("BIKE_MESSENGER", true, 0, 50);
	var url1 = "/app/content/mockdata/assets.json";
	
	$http.get(url1).then(function(response) {
		$scope.assets = response.data.data;
		console.log(response)		
		$scope.loadingAssets = false;
	});

	$scope.selectionChanged = function (asset) {
		$scope.selectedAsset = asset;
	};

	$scope.ok = function () {
		console.log($scope.selectedAsset);
		$uibModalInstance.close($scope.selectedAsset);
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
  	};
}

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