'use strict';

app.controller('createOrderController', ['$scope', 'orderFactory', 'mapFactory',function($scope, orderFactory, mapFactory){
	var vm = $scope;
	vm.hello = orderFactory.hello;
	
	vm.OrderType = ["Ride", "Delivery"];
	vm.VehiclePreference = ["CNG","SEDAN"];
	
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


	vm.createNewOrder = orderFactory.createNewOrder;
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
			vm.newOrder.From.Address = address;
			$scope.$apply();
		};

		var markerToAddressFoundCallback = function (address, latLng) {
			var lat = latLng.lat();
			var lng = latLng.lng();

			vm.newOrder.To.Point.coordinates = [];

			vm.newOrder.To.Point.coordinates.push(lng);
			vm.newOrder.To.Point.coordinates.push(lat);
			vm.newOrder.To.Address = address;
			$scope.$apply();
		};

		var fromMarker = mapFactory.createMarker(23.790888, 90.391430, "From", true, "User is here", mapFactory.markerIconUri.start, map);
		mapFactory.markerDragEvent(fromMarker, markerFromAddressFoundCallback);
		var toMarker = mapFactory.createMarker(23.790888, 90.391430, "To", true, "User's destination", mapFactory.markerIconUri.destination, map);
		mapFactory.markerDragEvent(toMarker, markerToAddressFoundCallback);
	};
	
	mapFactory.createMap(23.790888, 90.391430, 'orderCreateMap', 14, createMarkersCallback);
}]);