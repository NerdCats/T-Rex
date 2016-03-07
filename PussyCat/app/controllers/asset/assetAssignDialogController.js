function assetAssignDialogController($scope, $mdDialog, $http) {
	
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

	var url1 = "http://localhost:23873/api/Account";
	var url2 = "http://127.0.0.1:8080/json/asset-list.json"
	
	$http.get(url1).then(function(response) {
		$scope.assets = response.data;

	});
	
	$scope.assignedAssets = [];
	
	$scope.assinged = function (asset) {
		console.log(asset);
		$scope.assignedAssets.push(asset);
	}
};