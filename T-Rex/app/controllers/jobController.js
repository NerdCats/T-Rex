'use strict';

app.controller('jobController', [ '$scope', '$http', '$interval', '$uibModal','$window', '$routeParams', 'menus', 'templates', 
	'host', 'tracking_host', 'tracking_link', 'timeAgo', 'jobFactory', 'mapFactory', 'restCall', 'patchUpdate', jobController]);



function jobController($scope, $http, $interval, $uibModal, $window, $routeParams,	menus, 
	templates, host, tracking_host, tracking_link, timeAgo,jobFactory, mapFactory, restCall, patchUpdate) {
	
	var vm = $scope;
	var id = $routeParams.id;	
	vm.job = jobFactory.job(id);
	vm.job.loadJob();

	
	
	vm.restore = function () {
		console.log(vm.job)
	}
	
	vm.open = function (size) {
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

				var result = patchUpdate(vm.selected.Id, "replace", 
										"/AssetRef", "api/job/", 
										vm.job.data.Id, vm.job.data.Tasks[0].id, 
										success, error);
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
		};
};


app.controller('ModalInstanceCtrl', ['$scope', '$http', '$uibModalInstance', 'host', ModalInstanceCtrl]);
function ModalInstanceCtrl($scope, $http, $uibModalInstance, host) {
	
	$scope.assets = [];
	$scope.loadingAssets = true;
	var assetListUrlMaker = function (type, envelope, page, pageSize) {
		var parameters =  "$filter=Type eq 'BIKE_MESSENGER'" + "&envelope=" + envelope + "&page=" + page + "&pageSize=" + pageSize;		
		var assetListUrl = host + "/api/Account/odata?" + parameters;		
		return assetListUrl;
	};

	var url1 = assetListUrlMaker("BIKE_MESSENGER", true, 0, 10);
	
	$http.get(url1).then(function(response) {
		$scope.assets = response.data.data;
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