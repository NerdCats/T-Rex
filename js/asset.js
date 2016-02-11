app.controller('assetController', function ($scope, $http, $interval, $mdDialog, $mdMedia, $location, $window, menus) {



	var url = "/json/assetlist.json";
	$scope.populateTable = function(url, Assets){
		$http.get(url).then(function(response){
			var assets = response.data;			
			console.log(assets)
			angular.forEach(assets.data, function(value, key){
				var asset = {
					Username : value.Username,
					Type : value.Type,
					Phone : value.Phone,
					CurrentLocation : value.CurrentLocation,
					AreaOfOperation : value.AreaOfOperation,
					IsAvailable : value.IsAvailable,
					State : value.State,
					Details : function(){
						$window.location.href = '/index.html?id='+ value._id;
					}
				};
				Assets.push(asset);
				console.log(asset)
			});
			$scope.pages = function(){
				var arr = [];
				for (var i = 1; i <= assets.pagination.TotalPages ; i++) {
					arr.push(i);
				};
				return arr;
			};
			console.log($scope.pages())
		});
	};

	$scope.assetlist = [];
	$scope.populateTable(url, $scope.assetlist)
});