'use strict';

app.controller('createOrderController', ['$scope', 'orderFactory',function($scope, orderFactory){
	var vm = $scope;
	vm.hello = orderFactory.hello;
	vm.OrderType = ["RIDE", "FETCH"];
	vm.VehiclePreference = ["CNG","SEDAN"];
	vm.newOrder = {
	    From: {
	        Point: {
	            type: "Point",
	            coordinates: [
	                90,
	                21
	            ]
	        },
	        Address: ""
	    },
	    To: {
	        Point: {
	            type: "Point",
	            coordinates: [
	                90,
	                21
	            ]
	        },
	    	Address: ""
	    },
	    VehiclePreference: [],
	    //ProposedRide: null,
	    Name: "",
	    Type: "",
	    PayloadType: "",
	    User: "",
	    ETA: null,
	    ETAMinutes: 0
	};

	vm.createNewOrder = orderFactory.createNewOrder;
}]);