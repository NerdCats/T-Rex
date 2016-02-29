'use strict';

app.controller('detailsController', detailsController);

function detailsController($scope,$http,$interval,$mdDialog,$mdMedia,$location,$window,menus,templates,listToString,$routeParams) {
	
	var id = $routeParams.id;	
	console.log(id)

	var vm = $scope;
	vm.menus = menus; 
	vm.templates = templates;
	vm.listToString = listToString;	
	vm.job = {};
	vm.jobStates = [];
	vm.locations = [];
	vm.jobTaskStates = ["PENDING","IN_PROGRESS","COMPLETED"];
	vm.jobState = ["ENQUEUED","IN_PROGRESS","COMPLETED"];
	vm.assignAsset = ["Assign new Asset", "Change current Asset"];
	vm.markerIconUri = {
		blueMarker : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
		redMarker : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
		purpleMarker : "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
		yellowMarker : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
		greenMarker : "http://maps.google.com/mapfiles/ms/icons/green-dot.png"		
	};
	

	vm.jobStateChanged = function (state) {
		vm.job.State = state;
	};
	

	function populateLocation() {
		return [
				 {
					user : vm.job.Order.From.Address,
					lat : vm.job.Order.From.Point.coordinates[1],
					lng : vm.job.Order.From.Point.coordinates[0],
					title : "User's location",
					desc : vm.job.Order.From.Address,
					markerUrl : vm.markerIconUri.greenMarker				
				},
				{
					user : vm.job.User,
					lat : vm.job.Order.To.Point.coordinates[1],
					lng : vm.job.Order.To.Point.coordinates[0],
					title : "User's destination",
					desc : vm.job.Order.To.Address,
					markerUrl : vm.markerIconUri.redMarker				
				},
				{
					user : "Asset Nazrul",
					lat : 23.800490,
					lng: 90.408450,
					title : "Asset's Location",
					desc : "Somewhere Asset is",
					markerUrl : vm.markerIconUri.purpleMarker				
				}
			];
	};
	function populateTaskState() {
		var jobStates = [];
		if (vm.job.Order.Type == "Ride") {
			var findAsset = {
				job : "Find Asset",
				jobTaskStates : vm.job.Tasks[0].State,
				stateChanged : function (state) {
					this.jobTaskStates = state;
					console.log(this.jobTaskStates);
				}
			};
			var assetIsOnWay = {
				job : "Asset is on way",
				jobTaskStates : vm.job.Tasks[0].State,
				stateChanged : function (state) {
					this.jobTaskStates = state;
					console.log(this.jobTaskStates);
				}
			};
			var pickUp = {
				job : "Pick up",
				jobTaskStates : vm.job.Tasks[1].State,
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
	function timeAgo() {
		var creationTime = new Date(vm.job.CreateTime);
		var nowTime = Date.now();
		var diffInMin = (nowTime - creationTime)/1000/60;
		var time =  Math.round(diffInMin);
		console.log(time)
		return time;
	};

	var url1 = "http://localhost:23873/api/Job?id="+id;
	var url2 = "http://127.0.0.1:8080/json/order.json"
	$http.get(url1).then(function(response) {
		vm.job = response.data;				
		vm.locations = populateLocation();
		vm.jobStates = populateTaskState();		
		vm.requestedAgo = timeAgo();
		// console.log(vm.requestedAgo)

		vm.detailsTable = {
			orderId : vm.job._id,
			user : vm.job.User,
			phoneNumber : "01911725897",
			orderType : vm.job.Order.Type,
			preferences : listToString(vm.job.Order.VehiclePreference),
			eta : ""
		}

		vm.asset = {
			name : "Rahim Mia",
			phoneNumber : "01911726389"
		}

		vm.servingby = {
			name : "Redwan"
		}

		var mapOptions = {
			zoom: 16,
			center: new google.maps.LatLng(vm.locations[0].lat, vm.locations[0].lng),
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};

		

		//create map
		vm.map = new google.maps.Map(document.getElementById('map'), mapOptions);
		vm.markers = [];

		var infoWindow = new google.maps.InfoWindow();
		var createMarker = function (info){
			var marker = new google.maps.Marker({
			  	map: vm.map,
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
			  	infoWindow.open(vm.map, marker);
			});
			vm.markers.push(marker);
		}
		
		createMarker(vm.locations[0]);
		createMarker(vm.locations[1]);
		createMarker(vm.locations[2]);
	});

		vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
		vm.assetAssignPopup = function (ev) {
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
		    $mdDialog.show({
		      controller: DialogController,
		      templateUrl: templates.availableAsset,
		      parent: angular.element(document.body),
		      targetEvent: ev,
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
};


function DialogController(vm, $mdDialog, $http) {
	vm.hide = function() {
		$mdDialog.hide();
	};
	vm.cancel = function() {
		$mdDialog.cancel();
	};
	vm.answer = function(answer) {
		console.log("this is from answer hiding");
		console.log(vm.assignedAssets)
		$mdDialog.hide(vm.assignedAssets);
	};

	var url = "http://localhost:23873/api/Job?id=56a5c7571510df254024dc59";
	var url2 = "http://127.0.0.1:8080/json/asset-list.json"
	$http.get(url2).then(function(response) {
		vm.assets = response.data;
		console.log(vm.assets);
	});
	vm.assignedAssets = [];
	vm.assinged = function (asset) {
		vm.assignedAssets.push(asset);
	}
}
