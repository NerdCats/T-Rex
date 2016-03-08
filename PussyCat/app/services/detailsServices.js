'use strict';

angular.module('app').factory('jobDetailsFactory', function(listToString, markerIconUri, $http, $mdMedia, $mdDialog, templates, patchUpdate){
	
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

	var populateJobTaskState = function (job) {

		var success = function (response) {
			console.log("success : ");
  			console.log(response);
  			alert("success");
  			location.reload();
  			return true;
		};

		var error = function (response) {
			console.log("error : ");
  			console.log(response);
  			alert("failed");
  			return false;
		};

		var jobStates = [];
		if (job.Order.Type == "Ride") {
			var findAsset = {
				job : "Find Asset",
				jobTaskStates : job.Tasks[0].State,
				stateChanged : function (state) {					
					console.log(this.jobTaskStates);					
					var result = patchUpdate(state, "/State", "replace", job._id, job.Tasks[0].id, success, error);
					if (result) this.jobTaskStates = state;
				}
			};
			var assetIsOnWay = {
				job : "Asset is on way",
				jobTaskStates : job.Tasks[1].State,
				stateChanged : function (state) {
					console.log(this.jobTaskStates);
					var result = patchUpdate(state, "/State", "replace", job._id, job.Tasks[1].id, success, error);
					if (result) this.jobTaskStates = state;
				}
			};
			jobStates.push(findAsset)
			jobStates.push(assetIsOnWay)
		};
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
		var assets = [];
		angular.forEach(job.Assets, function (value, key) {
			var asset  = {
				name : value.Profile.FirstName,
				phoneNumber : value.phoneNumber,
				currentLocation : "Banani",
				type : value.Type
			}
			assets.push(asset);
			console.log(assets)
		});
		return assets;
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

	var populateAssetAssignDialog = function (vm, event, job) {

		var success = function (response) {
			console.log("success : ");
  			console.log(response);
  			alert("success");
  			location.reload();
  			return true;
		};

		var error = function (response) {
			console.log("error : ");
  			console.log(response);
  			alert("failed");
  			return false;
		};

		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;

	    $mdDialog.show({
			controller: assetAssignDialogController,
			templateUrl: templates.availableAsset,
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose:true,
			fullscreen: useFullScreen,
			job: job
	    })
	    .then(function(selectedAssets) {		    
		    var result = patchUpdate(selectedAssets[0].Id, "/AssetRef", "replace", job._id, job.Tasks[0].id, success, error);			
	    }, function() {
			console.log("Asset Assign dialog canceled");
	    });

	    vm.$watch(function() {
	      return $mdMedia('xs') || $mdMedia('sm');
	    }, function(wantsFullScreen) {
	      vm.customFullscreen = (wantsFullScreen === true);
	    });	

	};


	return {		 
		populateLocation : populateLocation,
		populateJobTaskState : populateJobTaskState,
		populateJobDetailsTable : populateJobDetailsTable,
		populateAssetInfo : populateAssetInfo,
		populateServingBy : populateServingBy,
		populateMap : populateMap,
		populateAssetAssignDialog : populateAssetAssignDialog
	}
});
