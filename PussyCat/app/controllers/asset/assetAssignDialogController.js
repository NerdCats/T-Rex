function assetAssignDialogController($scope, $mdDialog, $http, host) {
	
	$scope.hide = function() {
		$mdDialog.hide();
	};
	
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
	$scope.answer = function(answer) {
		console.log("this is from answer hiding");
		console.log($scope.assignedAssets)
		$mdDialog.hide($scope.assignedAssets);
	};

	var url1 = host + "/api/Account";
		
	$http.get(url1).then(function(response) {
		$scope.assets = response.data;
	});
	
	$scope.assignedAssets = [];
	
	$scope.assinged = function (asset) {
		console.log(asset);
		$scope.assignedAssets.push(asset);
	}
};