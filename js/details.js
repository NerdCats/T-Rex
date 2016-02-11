
var app = angular.module('details', ['ngMaterial','ngMessages']);
app.config(function($locationProvider) {
	$locationProvider.html5Mode(true);
});
app.controller('detailsController', function ($scope, $http, $interval, $mdDialog, $mdMedia, $location, $window) {
	
	var id = $location.search().id;
	$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');


	$scope.templates = [ 
	 	{ name: 'sidebar.html', url: 'template/sidebar.html'},
      	{ name: 'template2.html', url: 'template2.html'} 
    ];
	//menu options
	$scope.menus = [
		{Title : "Dashboard",  Navigate: function(){$window.location.href = '/index.html'}},
		{Title : "Orders",  Navigate: function(){$window.location.href = '/index.html'}},
		{Title : "Users",  Navigate: function(){$window.location.href = '/index.html'}},
		{Title : "Assets",  Navigate: function(){$window.location.href = '/index.html'}},
		{Title : "Agents",  Navigate: function(){$window.location.href = '/index.html'}},
		{Title : "Administration",  Navigate: function(){$window.location.href = '/index.html'}}
	];

	//marker colors
	$scope.markerIconUri = {
		blueMarker : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
		redMarker : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
		purpleMarker : "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
		yellowMarker : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
		greenMarker : "http://maps.google.com/mapfiles/ms/icons/green-dot.png"		
	}

	//get jobs json
	var url1 = "http://localhost:23873/api/Job?id="+id;
	var url2 = "http://127.0.0.1:8080/json/order.json"
	console.log(url1);
	$http.get(url1).then(function(response) {
		$scope.job = response.data;
		console.log($scope.job);

		
		
		$scope.locations = [
			 {
				user : $scope.job.Order.From.Address,
				lat : $scope.job.Order.From.Point.coordinates[1],
				lng : $scope.job.Order.From.Point.coordinates[0],
				title : "User's location",
				desc : $scope.job.Order.From.Address,
				markerUrl : $scope.markerIconUri.greenMarker				
			},
			{
				user : $scope.job.User,
				lat : $scope.job.Order.To.Point.coordinates[1],
				lng : $scope.job.Order.To.Point.coordinates[0],
				title : "User's destination",
				desc : $scope.job.Order.To.Address,
				markerUrl : $scope.markerIconUri.redMarker				
			},
			{
				user : "Asset Nazrul",
				lat : 23.800490,
				lng: 90.408450,
				title : "Asset's Location",
				desc : "Somewhere Asset is",
				markerUrl : $scope.markerIconUri.purpleMarker				
			}
		];


		$scope.assignAsset = ["Assign new Asset", "Change current Asset"];

		$scope.assetAssignPopup = function (ev) {
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
		    $mdDialog.show({
		      controller: DialogController,
		      templateUrl: "template/asset.tmpl.html",
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: useFullScreen
		    })
		    .then(function(answer) {
		      $scope.status = 'You said the information was "' + answer + '".';
		    	console.log(answer);
		      console.log($scope.status);
		    }, function() {
		      $scope.status = 'You cancelled the dialog.';
		      console.log($scope.status);
		    }, function (assignedAssets) {
		    });

		    $scope.$watch(function() {
		      return $mdMedia('xs') || $mdMedia('sm');
		    }, function(wantsFullScreen) {
		      $scope.customFullscreen = (wantsFullScreen === true);
		    });
		};

		$scope.jobStates = [];
		(function assignJobsState() {
			if ($scope.job.Order.Type == "Ride") {
				var findAsset = {
					job : "Find Asset",
					jobTaskStates : $scope.job.Tasks[0].State,
					stateChanged : function (state) {
						this.jobTaskStates = state;
						console.log(this.jobTaskStates);
					}
				};
				var assetIsOnWay = {
					job : "Asset is on way",
					jobTaskStates : $scope.job.Tasks[0].State,
					stateChanged : function (state) {
						this.jobTaskStates = state;
						console.log(this.jobTaskStates);
					}
				};
				var pickUp = {
					job : "Pick up",
					jobTaskStates : $scope.job.Tasks[1].State,
					stateChanged : function (state) {
						this.jobTaskStates = state;
						console.log(this.jobTaskStates);
					}
				};

				$scope.jobStates = [findAsset, assetIsOnWay, pickUp]
			};
		})();

		$scope.jobTaskStates = ["PENDING","IN_PROGRESS","COMPLETED"];

		$scope.jobState = ["ENQUEUED","IN_PROGRESS","COMPLETED"];
		$scope.jobStateChanged = function (state) {
			$scope.job.State = state;
		}


		$scope.requestedAgo = function () {
			var creationTime = new Date($scope.job.CreateTime);
			var nowTime = Date.now();
			var diffInMin = (nowTime - creationTime)/1000/60;
			return Math.round(diffInMin);
		}

		$scope.detailsTable = {
			orderId : $scope.job._id,
			user : $scope.job.User,
			phoneNumber : "01911725897",
			orderType : $scope.job.Order.Type,
			preferences : $scope.job.Order.VehiclePreference[0],
			eta : ""
		}

		$scope.asset = {
			name : "Rahim Mia",
			phoneNumber : "01911726389"
		}

		$scope.servingby = {
			name : "Redwan"
		}

		var mapOptions = {
			zoom: 16,
			center: new google.maps.LatLng($scope.locations[0].lat, $scope.locations[0].lng),
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};

		

		//create map
		$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
		$scope.markers = [];

		var infoWindow = new google.maps.InfoWindow();
		var createMarker = function (info){
			var marker = new google.maps.Marker({
			  	map: $scope.map,
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
			  	infoWindow.open($scope.map, marker);
			});
			$scope.markers.push(marker);
		}
		
		createMarker($scope.locations[0]);
		createMarker($scope.locations[1]);
		createMarker($scope.locations[2]);
	});
});


function DialogController($scope, $mdDialog, $http) {
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
}
