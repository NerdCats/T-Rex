'use strict';

angular.module('app').factory('jobDetailsFactory', function(listToString, markerIconUri ){
	
	var locations= function (job){ 
		var userLocation  = {
			user : job.Order.From.Address,
			lat : job.Order.From.Point.coordinates[1],
			lng : job.Order.From.Point.coordinates[0],
			title : "User's location",
			desc : job.Order.From.Address,
			markerUrl : markerIconUri.greenMarker				
		};
		var userDestination = {
			user : job.User,
			lat : job.Order.To.Point.coordinates[1],
			lng : job.Order.To.Point.coordinates[0],
			title : "User's destination",
			desc : job.Order.To.Address,
			markerUrl : markerIconUri.redMarker				
		};
		var assetLocation = {
			// since asset module is not ready, just putting dummy location
			user : "Asset Nazrul",
			lat : 23.800490,
			lng: 90.408450,
			title : "Asset's Location",
			desc : "Somewhere Asset is",
			markerUrl : markerIconUri.purpleMarker				
		};
	};

	var populateLocation = function (job) {
		var userLocation  = {
			user : job.Order.From.Address,
			lat : job.Order.From.Point.coordinates[1],
			lng : job.Order.From.Point.coordinates[0],
			title : "User's location",
			desc : job.Order.From.Address,
			markerUrl : markerIconUri.greenMarker				
		};
		var userDestination = {
			user : job.User,
			lat : job.Order.To.Point.coordinates[1],
			lng : job.Order.To.Point.coordinates[0],
			title : "User's destination",
			desc : job.Order.To.Address,
			markerUrl : markerIconUri.redMarker				
		};
		var assetLocation = {
			// since asset module is not ready, just putting dummy location
			user : "Asset Nazrul",
			lat : 23.800490,
			lng: 90.408450,
			title : "Asset's Location",
			desc : "Somewhere Asset is",
			markerUrl : markerIconUri.purpleMarker				
		};

		return {
			userLocation : userLocation,
			userDestination : userDestination,
			assetLocation : assetLocation
		}
	};

	var populateTaskState = function (job) {
		var jobStates = [];
		if (job.Order.Type == "Ride") {
			var findAsset = {
				job : "Find Asset",
				jobTaskStates : job.Tasks[0].State,
				stateChanged : function (state) {
					this.jobTaskStates = state;
					console.log(this.jobTaskStates);
				}
			};
			var assetIsOnWay = {
				job : "Asset is on way",
				jobTaskStates : job.Tasks[0].State,
				stateChanged : function (state) {
					this.jobTaskStates = state;
					console.log(this.jobTaskStates);
				}
			};
			var pickUp = {
				job : "Pick up",
				jobTaskStates : job.Tasks[1].State,
				stateChanged : function (state) {
					this.jobTaskStates = state;
					console.log(this.jobTaskStates);
				}
			};
			jobStates.push(findAsset)
			jobStates.push(assetIsOnWay)
			jobStates.push(pickUp)
		};
		console.log(jobStates);
		return jobStates;
	};

	var populateJobDetailsTable = function (job) {
		var details = {
			orderId : job._id,
			user : job.User,
			phoneNumber : "01911725897",
			orderType : job.Order.Type,
			preferences : listToString(job.Order.VehiclePreference),
			eta : ""
		}
		return details;	
	};

	var populateAssetInfo = function (job) {
		var assetInfo  = {
			name : "Rahim Mia",
			phoneNumber : "01911726389"
		}
		return assetInfo;
	};

	var populateServingBy = function(job) {
		var servingby = {
			name : "Redwan"
		};
		return servingby;	
	};

	var populateMap = function (job, map, markers) {

		var locations = populateLocation(job);
		var mapOptions = {
			zoom: 16,
			center: new google.maps.LatLng(locations.userLocation.lat, locations.userLocation.lng),
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};
		map = new google.maps.Map(document.getElementById('map'), mapOptions);		
		var infoWindow = new google.maps.InfoWindow();

		var createMarker = function (info){
			var marker = new google.maps.Marker({
			  	map: map,
			  	position: new google.maps.LatLng(info.lat, info.lng),
			  	title: info.title
			});
			marker.setIcon(info.markerUrl);
			marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
			marker.addListener('click', toggleBounce);

			function toggleBounce() {
			  if (marker.getAnimation() !== null) {
			    marker.setAnimation(null);
			  } else {
			    marker.setAnimation(google.maps.Animation.BOUNCE);
			  }
			}
			google.maps.event.addListener(marker, 'click', function(){
			  	infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
			  	infoWindow.open(map, marker);
			});
			markers.push(marker);
		}
		
		createMarker(locations.userLocation);
		createMarker(locations.userDestination);
		createMarker(locations.assetLocation);
	};

	var populateAssetAssignDialog = function (vm,event) {
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
	    $mdDialog.show({
	      controller: assetAssignDialogController,
	      templateUrl: templates.availableAsset,
	      parent: angular.element(document.body),
	      targetEvent: event,
	      clickOutsideToClose:true,
	      fullscreen: useFullScreen
	    })
	    .then(function(answer) {
	      vm.status = 'You said the information was "' + answer + '".';
	    	console.log(answer);
	      console.log(vm.status);
	    }, function() {
	      vm.status = 'You cancelled the dialog.';
	      console.log(vm.status);
	    }, function (assignedAssets) {
	    });

	    vm.$watch(function() {
	      return $mdMedia('xs') || $mdMedia('sm');
	    }, function(wantsFullScreen) {
	      vm.customFullscreen = (wantsFullScreen === true);
	    });	
	};


	return {
		locations : locations,
		populateLocation : populateLocation,
		populateTaskState : populateTaskState,
		populateJobDetailsTable : populateJobDetailsTable,
		populateAssetInfo : populateAssetInfo,
		populateServingBy : populateServingBy,
		populateMap : populateMap,
		populateAssetAssignDialog : populateAssetAssignDialog

	}
});

angular.module('app').factory('populateLocation', function (markerIconUri) {
	return function (job) {
		var locations= { 
			userLocation : {
				user : job.Order.From.Address,
				lat : job.Order.From.Point.coordinates[1],
				lng : job.Order.From.Point.coordinates[0],
				title : "User's location",
				desc : job.Order.From.Address,
				markerUrl : markerIconUri.greenMarker				
			},
			userDestination: {
				user : job.User,
				lat : job.Order.To.Point.coordinates[1],
				lng : job.Order.To.Point.coordinates[0],
				title : "User's destination",
				desc : job.Order.To.Address,
				markerUrl : markerIconUri.redMarker				
			},
			assetLocation: {
				// since asset module is not ready, just putting dummy location
				user : "Asset Nazrul",
				lat : 23.800490,
				lng: 90.408450,
				title : "Asset's Location",
				desc : "Somewhere Asset is",
				markerUrl : markerIconUri.purpleMarker				
			}
		};
		return locations;
	}
});



angular.module('app').factory('populateTaskState', function () {
	return function (job) {
		var jobStates = [];
		if (job.Order.Type == "Ride") {
			var findAsset = {
				job : "Find Asset",
				jobTaskStates : job.Tasks[0].State,
				stateChanged : function (state) {
					this.jobTaskStates = state;
					console.log(this.jobTaskStates);
				}
			};
			var assetIsOnWay = {
				job : "Asset is on way",
				jobTaskStates : job.Tasks[0].State,
				stateChanged : function (state) {
					this.jobTaskStates = state;
					console.log(this.jobTaskStates);
				}
			};
			var pickUp = {
				job : "Pick up",
				jobTaskStates : job.Tasks[1].State,
				stateChanged : function (state) {
					this.jobTaskStates = state;
					console.log(this.jobTaskStates);
				}
			};
			jobStates.push(findAsset)
			jobStates.push(assetIsOnWay)
			jobStates.push(pickUp)
		};
		console.log(jobStates);
		return jobStates;
	};
});



angular.module('app').factory('populateJobDetailsTable', function (listToString) {
	return function (job) {
		var details = {
			orderId : job._id,
			user : job.User,
			phoneNumber : "01911725897",
			orderType : job.Order.Type,
			preferences : listToString(job.Order.VehiclePreference),
			eta : ""
		}
		return details;	
	};
});

angular.module('app').factory('populateAssetInfo', function () {
	return function (job) {
		var assetInfo  = {
			name : "Rahim Mia",
			phoneNumber : "01911726389"
		}
		return assetInfo;
	};
});

angular.module('app').factory('populateServingBy', function () {
	return	function(job) {
		var servingby = {
			name : "Redwan"
		};
		return servingby;	
	};

});

angular.module('app').factory('populateMap', function () {
	return function (map, markers,locations) {
		var mapOptions = {
			zoom: 16,
			center: new google.maps.LatLng(locations.userLocation.lat, locations.userLocation.lng),
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};
		map = new google.maps.Map(document.getElementById('map'), mapOptions);		
		var infoWindow = new google.maps.InfoWindow();

		var createMarker = function (info){
			var marker = new google.maps.Marker({
			  	map: map,
			  	position: new google.maps.LatLng(info.lat, info.lng),
			  	title: info.title
			});
			marker.setIcon(info.markerUrl);
			marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
			marker.addListener('click', toggleBounce);

			function toggleBounce() {
			  if (marker.getAnimation() !== null) {
			    marker.setAnimation(null);
			  } else {
			    marker.setAnimation(google.maps.Animation.BOUNCE);
			  }
			}
			google.maps.event.addListener(marker, 'click', function(){
			  	infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
			  	infoWindow.open(map, marker);
			});
			markers.push(marker);
		}
		
		createMarker(locations.userLocation);
		createMarker(locations.userDestination);
		createMarker(locations.assetLocation);
	};
});


angular.module('app').factory('populateAssetAssignDialog', function ($mdMedia,$mdDialog, templates) {
	return function (vm,event) {
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
	    $mdDialog.show({
	      controller: assetAssignDialogController,
	      templateUrl: templates.availableAsset,
	      parent: angular.element(document.body),
	      targetEvent: event,
	      clickOutsideToClose:true,
	      fullscreen: useFullScreen
	    })
	    .then(function(answer) {
	      vm.status = 'You said the information was "' + answer + '".';
	    	console.log(answer);
	      console.log(vm.status);
	    }, function() {
	      vm.status = 'You cancelled the dialog.';
	      console.log(vm.status);
	    }, function (assignedAssets) {
	    });

	    vm.$watch(function() {
	      return $mdMedia('xs') || $mdMedia('sm');
	    }, function(wantsFullScreen) {
	      vm.customFullscreen = (wantsFullScreen === true);
	    });	
	};
})