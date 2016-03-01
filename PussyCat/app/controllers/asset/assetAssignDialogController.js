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

	var url = "http://localhost:23873/api/Job?id=56a5c7571510df254024dc59";
	var url2 = "http://127.0.0.1:8080/json/asset-list.json"
	$http.get(url2).then(function(response) {
		$scope.assets = response.data;
		console.log($scope.assets);
	});
	$scope.assignedAssets = [];
	$scope.assinged = function (asset) {
		$scope.assignedAssets.push(asset);
	}
};