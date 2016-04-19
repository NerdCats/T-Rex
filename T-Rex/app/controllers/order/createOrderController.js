'use strict';

app.controller('createOrderController', ['$scope', '$rootScope', '$mdToast', 'orderFactory', 'mapFactory', createOrderController]);

createOrderController.$inject = ['$rootScope', '$log'];

function createOrderController($scope, $rootScope, $mdToast, orderFactory, mapFactory){

	var vm = this;
	vm.hello = orderFactory.hello;

	vm.OrderType = ["Ride", "Delivery"];
	vm.VehiclePreference = ["CNG","SEDAN"];
	
	vm.placesResults = [];
	vm.SelectedTo = "";
	vm.SelectedTo = "";

	vm.isOrderSelected = false;
	vm.RideOrderSelected = false;
	vm.DeliveryOrderSelected = false;
	vm.FromLabel = "From";
	vm.ToLabel = "To";

	vm.newOrder = {
	    From: {
	        Point: {
	            type: "Point",
	            coordinates: [
	            ]
	        },
	        Address: ""
	    },
	    To: {
	        Point: {
	            type: "Point",
	            coordinates: [
	            ]
	        },
	    	Address: ""
	    },
	    Name: "",
	    Type: "",
	    PackageDescription : "",
	    PackageWeight : 0,
	    PayloadType: "",
	    User: "",
	    ETA: null,
	    ETAMinutes: 0
	};


	vm.createNewOrder = function (newOrder) {
		// TODO: This is the code for showing a Toast when you dont have coordinates
		// Would move this to a service someday	
		var last = {
			bottom: false,
			top: true,
			left: false,
			right: true
	    };
		$scope.toastPosition = angular.extend({},last);
			$scope.getToastPosition = function() {
			sanitizePosition();
			return Object.keys($scope.toastPosition)
			  .filter(function(pos) { return $scope.toastPosition[pos]; })
			  .join(' ');
		};
		function sanitizePosition() {
			var current = $scope.toastPosition;
			if ( current.bottom && last.top ) current.top = false;
			if ( current.top && last.bottom ) current.bottom = false;
			if ( current.right && last.left ) current.left = false;
			if ( current.left && last.right ) current.right = false;
			last = angular.extend({},current);
		}

		if (newOrder.From.Point.coordinates.length == 0 || newOrder.To.Point.coordinates.length == 0) {
			var pinTo = $scope.getToastPosition();
			$mdToast.show(
			  	$mdToast.simple()
					.textContent('Simple Toast!')
					.position(pinTo )
					.hideDelay(3000)
			);
		} else {
			// If you have a coordinates of both From and To, then it creates an order
			orderFactory.createNewOrder(newOrder);			
		}		
	} 
		
	vm.orderTypeSelected = function (type) {

		vm.isOrderSelected = true;
		if (type == "Ride") {
			vm.RideOrderSelected = true;
			vm.DeliveryOrderSelected = false;

			vm.FromLabel = "User's Location";
			vm.ToLabel = "User's Destination";
		} else if ("Delivery") {
			vm.RideOrderSelected = false;
			vm.DeliveryOrderSelected = true;

			vm.FromLabel = "Pick Up Location";
			vm.ToLabel = "Delivery Location";
		}
	};


	var createMarkersCallback = function (map) { // need a map parameter to reuse mapService

		var markerFromAddressFoundCallback = function (address, latLng) {
			var lat = latLng.lat();
			var lng = latLng.lng();

			vm.newOrder.From.Point.coordinates = [];

			vm.newOrder.From.Point.coordinates.push(lng);
			vm.newOrder.From.Point.coordinates.push(lat);
			// vm.newOrder.From.Address = address;
			$scope.$apply();
		};

		var markerToAddressFoundCallback = function (address, latLng) {
			var lat = latLng.lat();
			var lng = latLng.lng();

			vm.newOrder.To.Point.coordinates = [];

			vm.newOrder.To.Point.coordinates.push(lng);
			vm.newOrder.To.Point.coordinates.push(lat);
			// vm.newOrder.To.Address = address;
			$scope.$apply();
		};

		// var fromMarker = mapFactory.createMarker(23.790888, 90.391430, "From", true, "User is here", mapFactory.markerIconUri.start, map);
		// mapFactory.markerDragEvent(fromMarker, markerFromAddressFoundCallback);
		// var toMarker = mapFactory.createMarker(23.790888, 90.391430, "To", true, "User's destination", mapFactory.markerIconUri.destination, map);
		// mapFactory.markerDragEvent(toMarker, markerToAddressFoundCallback);
	};
	
	mapFactory.createMap(23.790888, 90.391430, 'orderCreateMap', 14, createMarkersCallback);
	// You should initialize the search box after creating the map, right?
	vm.searchAddress = function () {		
		mapFactory.searchBox(vm.toSearchText);
	};

	// Adding context menue on map
	var mapElement = document.getElementById('orderCreateMap');	
	mapFactory.mapContextMenuForCreateOrder(mapElement);

};