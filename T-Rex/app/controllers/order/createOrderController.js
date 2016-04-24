'use strict';

app.controller('createOrderController', ['$scope', '$rootScope', '$mdToast', 'orderFactory', 'mapFactory', createOrderController]);

createOrderController.$inject = ['$rootScope', '$log'];

function createOrderController($scope, $rootScope, $mdToast, orderFactory, mapFactory){

	var vm = this;
	vm.hello = orderFactory.hello;

	vm.OrderType = ["Delivery"];
	vm.VehiclePreference = ["CNG","SEDAN"];
	
	vm.placesResults = [];
	vm.SelectedTo = "";
	vm.SelectedTo = "";

	vm.isOrderSelected = true;
	vm.RideOrderSelected = false;
	vm.DeliveryOrderSelected = true;
	vm.FromLabel = "From";
	vm.ToLabel = "To";

	vm.newOrder = {
	    From: {
	        Point: {
	            type: "Point",
	            coordinates: [
	            ]
	        },
	        Address: "",
	        PostalCode: null,
			Floor: null,
			HouseNumber: null,
			AddressLine1: null,
			AddressLine2: null,
			Country: null,
			City: null,
			State: null,
			Provider: "Default"
	    },
	    To: {
	        Point: {
	            type: "Point",
	            coordinates: [
	            ]
	        },
	    	Address: "",
	    	PostalCode: null,
			Floor: null,
			HouseNumber: null,
			AddressLine1: null,
			AddressLine2: null,
			Country: null,
			City: null,
			State: null,
			Provider: "Default"
	    },
	    Name: "",
	    Type: "",
	    PackageDescription : "",
	    PackageWeight : 0,
	    PayloadType: "",
	    NoteToDeliveryMan: null,
	    UserId: "",
	    OrderLocation: null,
	    ETA: null,
	    ETAMinutes: 0,
	    PaymentMethod: null
	};


	vm.createNewOrder = function (newOrder) {
		// TODO: This is the code for showing a Toast when you dont have coordinates
		// Would move this to a service someday	
		console.log(vm.newOrder);
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

		if (vm.newOrder.From.Point.coordinates.length == 0 || vm.newOrder.To.Point.coordinates.length == 0) {
			var pinTo = $scope.getToastPosition();
			$mdToast.show(
			  	$mdToast.simple()
					.textContent('Please mark locations on the map')
					.position(pinTo )
					.hideDelay(3000)
			);
		} else {
			// If you have a coordinates of both From and To, then it creates an order
			orderFactory.createNewOrder(vm.newOrder);			
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

	mapFactory.createMap(23.790888, 90.391430, 'orderCreateMap', 14);
	
	vm.currentMarkerLocation = {lat:0,lng:0};
	vm.getCurrentMarkerLocationCallback = function (lat, lng) {
		vm.currentMarkerLocation.lat = lat;
		vm.currentMarkerLocation.lng = lng;
		console.log(lat + " " + lng)
	}

	// You should initialize the search box after creating the map, right?
	vm.searchAddress = function () {		
		mapFactory.searchBox(vm.toSearchText, vm.getCurrentMarkerLocationCallback);
	};


	vm.setFromLocationCallback = function (lat, lng) {
		console.log(lat + " " + lng)
		vm.currentMarkerLocation.lat = lat;
		vm.currentMarkerLocation.lng = lng;
		
		vm.newOrder.From.Point.coordinates = [];
		vm.newOrder.From.Point.coordinates.push(lng);
		vm.newOrder.From.Point.coordinates.push(lat);
		$scope.$apply();
	}

	vm.setToLocationCallback = function (lat, lng) {
		console.log(lat + " " + lng)
		vm.currentMarkerLocation.lat = lat;
		vm.currentMarkerLocation.lng = lng;

		vm.newOrder.To.Point.coordinates = [];
		vm.newOrder.To.Point.coordinates.push(lng);
		vm.newOrder.To.Point.coordinates.push(lat);
		$scope.$apply();
	}

	mapFactory.mapContextMenuForCreateOrder(vm.setFromLocationCallback, vm.setToLocationCallback);

};