'use strict';

app.controller('createOrderController', ['$scope', '$window', 'host', 'restCall', '$rootScope', '$mdToast', 'orderFactory', 'mapFactory', createOrderController]);

createOrderController.$inject = ['$rootScope', '$log'];

function createOrderController($scope, $window, host, restCall, $rootScope, $mdToast, orderFactory, mapFactory){

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

	// vm.noCache = 
	// vm.selectedItem = 
	vm.autocompleteUserNames = [];	
	vm.searchText = "";

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
	    PackageList : [
	    	{
	    		"Item": "Item 1",
				"Quantity": 1,
				"Price": 20,
				"VAT": 15,
				"CreatedTime": "2016-04-21T10:05:02.161Z",
				"Total": 20,
				"VATAmount": 3,
				"TotalPlusVAT": 23,
				"Weight": 0.45
	    	}
	    ],
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

	vm.CreateNewUser = CreateNewUser;
	vm.searchTextChange = searchTextChange;
	vm.selectedItemChange = selectedItemChange;
	vm.querySearch = querySearch;
	vm.createNewOrder = createNewOrder;

	vm.orderTypeSelected = orderTypeSelected;

	vm.currentMarkerLocation = {lat:0,lng:0};
	mapFactory.createMap(23.790888, 90.391430, 'orderCreateMap', 14);
	vm.searchAddress = searchAddress;
	mapFactory.mapContextMenuForCreateOrder(setFromLocationCallback, setToLocationCallback);

	loadUserNames();




	function CreateNewUser() {
		$window.location.href = '#/asset/create';
	}

	function searchTextChange(text) {
		console.log("Text changed to " + text);
	}

	function selectedItemChange(item) {
		console.log("Item changed to " + item.UserName);
		vm.newOrder.UserId = item.Id
	}

	function querySearch(query) {
		var results = query ? vm.autocompleteUserNames.filter( createFilterFor(query)) : vm.autocompleteUserNames, deferred;
		console.log(results)
		return results;
	} 
	
	function loadUserNames(){
		function successCallback(response) {
			vm.autocompleteUserNames = response.data;	
			console.log(vm.autocompleteUserNames)
		}
		function errorCallback(error) {
			console.log(error);
		}
		restCall('GET', host + "api/account", null, successCallback, errorCallback)
		console.log("loadUserNames")
	};

	function createFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);

		return function filterFn(state) {			
			return(state.UserName.indexOf(lowercaseQuery) === 0)			
		};
	}

	function createNewOrder(newOrder) {
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
		
	function orderTypeSelected(type) {		
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

	function getCurrentMarkerLocationCallback(lat, lng) {
		vm.currentMarkerLocation.lat = lat;
		vm.currentMarkerLocation.lng = lng;
		console.log(lat + " " + lng)
	}

	// You should initialize the search box after creating the map, right?
	function searchAddress() {
		mapFactory.searchBox(vm.toSearchText, getCurrentMarkerLocationCallback);
	};


	function setFromLocationCallback(lat, lng) {
		console.log(lat + " " + lng)
		vm.currentMarkerLocation.lat = lat;
		vm.currentMarkerLocation.lng = lng;
		
		vm.newOrder.From.Point.coordinates = [];
		vm.newOrder.From.Point.coordinates.push(lng);
		vm.newOrder.From.Point.coordinates.push(lat);
		$scope.$apply();
	}

	function setToLocationCallback(lat, lng) {
		console.log(lat + " " + lng)
		vm.currentMarkerLocation.lat = lat;
		vm.currentMarkerLocation.lng = lng;

		vm.newOrder.To.Point.coordinates = [];
		vm.newOrder.To.Point.coordinates.push(lng);
		vm.newOrder.To.Point.coordinates.push(lat);
		$scope.$apply();
	}
};