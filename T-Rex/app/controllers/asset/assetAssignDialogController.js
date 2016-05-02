function assetAssignDialogController($scope, $mdDialog, $http, host) {
	

	var assetListUrlMaker = function (type, envelope, page, pageSize) {
		var parameters =  "$filter=Type eq 'BIKE_MESSENGER'" + "&envelope=" + envelope + "&page=" + page + "&pageSize=" + pageSize;		
		var assetListUrl = host + "/api/Account/odata?" + parameters;		
		return assetListUrl;
	};
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

	var url1 = assetListUrlMaker("BIKE_MESSENGER", true, 0, 10);
		
	$http.get(url1).then(function(response) {
		$scope.assets = response.data.data;
	});
	
	$scope.assignedAssets = [];
	
	$scope.assinged = function (asset) {
		console.log(asset);
		$scope.assignedAssets.push(asset);
	}
};