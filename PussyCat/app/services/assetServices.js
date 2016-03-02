angular.module('app').factory('populateAssetTable', function($http, $window){
	return function (Assets, url){
		$http.get(url).then(function(response){
			var assets = response.data;			
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
				Assets.Collection.push(asset);
			});
			console.log(Assets.Collection)
			for (var i = 0; i < assets.pagination.TotalPages ; i++) {
				Assets.pages.push(i);
			};
			console.log(Assets.Collection);
			console.log(Assets.pages)
		});
	};
});



angular.module('app').factory('registerNewAsset', function($http){
	return function (asset){
		console.log(asset);
  		$http({
  			method: 'POST',
  			url: 'http://localhost:23873/api/Account/Register',
  			data: asset,
  			header: {
  				'Content-Type' : 'application/json'
  			} 
  		}).then(function success(response) {
  			console.log("success : ");
  			console.log(response);
  			$window.location.href = '#/asset';

  		}, function error(response) {
  			console.log("error : ");
  			console.log(response);
  		});
	};
});