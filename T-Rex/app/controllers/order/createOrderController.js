'use strict';

app.controller('createOrderController', ['$scope', '$window',  'host', 'UrlPath', 'restCall', '$rootScope',  '$routeParams', 'orderFactory', 'mapFactory', createOrderController]);

function createOrderController($scope, $window, host, UrlPath, restCall, $rootScope, $routeParams, orderFactory, mapFactory){

	var vm = $scope;

	vm.OrderType = ["Delivery"];
	vm.VehiclePreference = ["CNG","SEDAN"];
	vm.LocalAreas = ['Bailey Road',
		            'Banani',
		            'Banani DOHS',
		            'Baridhara',
		            'Baridhara DOHS',
		            'Basabo',
		            'Bashundhara',
		            'Cantonment',
		            'Chowdhurypara',
		            'Dhanmondi',
		            'Elephant Road',
		            'Eskaton',
		            'Goran',
		            'Green road',
		            'Gulshan 1',
		            'Gulshan 2',
		            'Hatirpul Residential Area',
		            'Indira Road',
		            'Kakrail',
		            'Katabon',
		            'Khilgaon',
		            'Khilgaon-taltola',
		            'Lalmatia',
		            'Malibagh',
		            'Mirpur',
		            'Mirpur-1',
		            'Mirpur-10',
		            'Mirpur-11',
		            'Mirpur-12',
		            'Mirpur-13',
		            'Mirpur-14',
		            'Mirpur-2',
		            'Mirpur-6',
		            'Mirpur-7',
		            'Mirpur-Pallabi',
		            'Mohakhali',
		            'Mohakhali DOHS',
		            'Mohammadpur',
		            'Motijheel',
		            'Narinda',
		            'Niketan',
		            'Nikunjo - 2',
		            'Paltan',
		            'Panthapath',
		            'Paribagh',
		            'Segunbagicha',
		            'Shantinagar',
		            'Shipahibag bazar',
		            'Shyamoli',
		            'Siddeshwari',
		            'Sonargaon Road',
		            'Tikatuli',
		            'Tnt colony',
		            'Uttara',
		            'Wari'];


	vm.PaymentMethod = [];
	vm.placesResults = [];

	vm.SelectedTo = "";
	vm.SelectedTo = "";

	vm.isOrderSelected = true;
	vm.RideOrderSelected = false;
	vm.DeliveryOrderSelected = true;
	vm.ordersIsBeingCreated = false;
	vm.FromLabel = "From";
	vm.ToLabel = "To";

	vm.selectedItem = {};
	vm.autocompleteUserNames = [];
	vm.searchText = "";

	vm.id = $routeParams.id;
		
	vm.isPutOrder = false;
	vm.jobId = "";
	vm.HRID = "";	


	if(vm.id == "new"){
		vm.order = orderFactory.newOrder;
	} else {		
		var jobUrl = host + "/api/job/" + vm.id;
		var successCallback = function(response){

			vm.order = response.data.Order;
			vm.jobId = response.data.Id;
			vm.HRID = response.data.HRID;
			vm.isPutOrder = true;			
			console.log(vm.order);
			// $scope.$apply();
		}
		var errorCallback = function(responese){
			console.log(responese);
			alert("No Job Found!!!");
		}
		restCall("GET", jobUrl, null, successCallback, errorCallback);
	}



 

	// vm.CreateNewUser = CreateNewUser;
	// vm.searchTextChange = searchTextChange;
	// vm.selectedItemChange = selectedItemChange;
	// vm.querySearch = querySearch;

	vm.createNewOrder = createNewOrder;
	// vm.orderTypeSelected = orderTypeSelected;

	vm.currentMarkerLocation = {lat:0,lng:0};
	mapFactory.createMap(23.790888, 90.391430, 'orderCreateMap', 14);
	// vm.searchAddress = searchAddress;
	// mapFactory.mapContextMenuForCreateOrder(setFromLocationCallback, setToLocationCallback);


	// loadPaymentMethods();

	// vm.AddItem = AddItem;
	// vm.RemoveItem = RemoveItem;

	// vm.itemChange = itemChange;


	// function AddItem() {
	// 	var newItem = {
 //    		"Item": "",
	// 		"Quantity": 0,
	// 		"Price": 0,
	// 		"VAT": 0,
	// 		"Total": 0,
	// 		"VATAmount": 0,
	// 		"TotalPlusVAT": 0,
	// 		"Weight": 0
 //    	};

	// 	vm.order.OrderCart.PackageList.push(newItem);
	// 	$scope.$apply();
	// }


	// function itemChange(index) {
	// 	var item = vm.order.OrderCart.PackageList[index];
	// 	item.Total = Math.round(item.Quantity * item.Price);
	// 	item.VATAmount = Math.round(item.Quantity*item.Price*(1 + item.VAT / 100) - item.Quantity*item.Price);
	// 	item.TotalPlusVAT = Math.round(item.Quantity*item.Price*(1 + item.VAT / 100));

	// 	vm.order.OrderCart.SubTotal = 0;
	// 	vm.order.OrderCart.TotalVATAmount = 0;
	// 	vm.order.OrderCart.TotalWeight = 0;
	// 	vm.order.OrderCart.TotalToPay = 0;

	// 	angular.forEach(vm.order.OrderCart.PackageList, function (value, key) {
	// 		vm.order.OrderCart.SubTotal += value.Total;
	// 		vm.order.OrderCart.TotalVATAmount += value.VATAmount;
	// 		vm.order.OrderCart.TotalWeight += value.Weight;
	// 		vm.order.OrderCart.TotalToPay += value.TotalPlusVAT;
	// 	});

	// 	// vm.order.OrderCart.TotalToPay += vm.order.OrderCart.ServiceCharge;
	// 	vm.order.OrderCart.TotalToPay = 0;

	// }

	// function RemoveItem(itemIndex) {
	// 	console.log(itemIndex);
	// 	vm.order.OrderCart.PackageList.splice(itemIndex, 1);
	// 	$scope.$apply();
	// }

	// function CreateNewUser() {
	// 	$window.location.href = '#/asset/create';
	// }

	// function searchTextChange(item) {
	// 	// vm.order.UserId = item.Id;
	// 	console.log(vm.selectedItem);
	// 	console.log(item);
	// }

	// function selectedItemChange(item) {
	// 	// console.log("Item changed to " + item.UserName);
	// 	// console.log("selectedItem : ")
	// 	console.log(vm.selectedItem)
	// 	console.log(item);
	// 	vm.order.UserId = item.Id;
	// 	console.log(vm.order.UserId);
	// }

	// function querySearch(query) {
	// 	loadUserNames(query);
	// 	var results = query ? vm.autocompleteUserNames.filter( createFilterFor(query)) : vm.autocompleteUserNames, deferred;
	// 	return results;
	// }

	// function loadUserNames(query){
	// 	function successCallback(response) {
	// 		vm.autocompleteUserNames = response.data.data;
	// 		console.log(vm.autocompleteUserNames)
	// 	}
	// 	function errorCallback(error) {
	// 		console.log(error);
	// 	}

	// 	var getUsersUrl = host + "api/account/odata?" + "$filter=startswith(UserName,'"+ query +"') eq true and Type eq 'USER' or Type eq 'ENTERPRISE'" + "&envelope=" + true + "&page=" + 0 + "&pageSize=" + 20;
	// 	console.log(getUsersUrl)
	// 	restCall('GET', getUsersUrl, null, successCallback, errorCallback)
	// 	console.log("loadUserNames")
	// };

	// function loadPaymentMethods() {
	// 	// function successCallback(response) {
	// 	// 	var paymentMethod = response.data;
	// 	// 	angular.forEach(paymentMethod, function (value, key) {
	// 	// 		 vm.PaymentMethod.push(value.Key);
	// 	// 	})

	// 	// 	console.log(vm.PaymentMethod)
	// 	// }
	// 	// function errorCallback(error) {
	// 	// 	console.log(error);
	// 	// }
	// 	// restCall('GET', host + "/api/Payment", null, successCallback, errorCallback)
	// 	vm.PaymentMethod.push("CashOnDelivery");
	// };


	// function createFilterFor(query) {
	// 	// var lowercaseQuery = angular.lowercase(query);
	// 	return function filterFn(state) {
	// 		return(state.UserName.indexOf(query) === 0)
	// 	};
	// }

	function createNewOrder() {
		// TODO: This is the code for showing a Toast when you dont have coordinates
		// Would move this to a service someday
		console.log(vm.order);
		// If you have a coordinates of both From and To, then it creates an order
		// vm.ordersIsBeingCreated = true;
		// // orderFactory.createNewOrder(vm.order, vm.ordersIsBeingCreated);
		// var successCallback = function (response) {
		// 	console.log("success : ");
		// 	vm.ordersIsBeingCreated = false;
		// 	if (vm.isPutOrder) {
		// 		alert("order successfully updated!");
		// 		$window.location.href = '#/job/' + vm.HRID;
		// 	} else {
		// 		alert("order successfully updated!");
		// 		$window.location.href = '#/job/' + response.data.HRID;
		// 	}
			
		};

	// 	var errorCallback = function error(error) {
	// 		console.log("error : ");
	// 		console.log(error);
	// 		vm.ordersIsBeingCreated = false;

	// 		var errorMsg = error.data.Message || "Server error";
	// 		var i = 0;
	//         if (error.data.ModelState) {
	//             errorMsg += "\n";
	//             if (error.data.ModelState["model.From.AddressLine1"]) {
	//                 var err = error.data.ModelState["model.From.AddressLine1"][0];
	//                 errorMsg += ++i + ". " + "Pickup Address is required" + "\n";
	//             }
	//             if (error.data.ModelState["model.To.AddressLine1"]) {
	//                 var err = error.data.ModelState["model.To.AddressLine1"][0];
	//                 errorMsg += ++i + ". " + "Delivery Address is required" + "\n";
	//             }
	//             if (error.data.ModelState["model.OrderCart.PackageList[0].Item"]) {
	//                 var err = error.data.ModelState["model.OrderCart.PackageList[0].Item"][0];
	//                 errorMsg += ++i + ". " + err + "\n";
	//             }
	//             if (error.data.ModelState["model.OrderCart.PackageList[0].Quantity"]) {
	//                 var err = error.data.ModelState["model.OrderCart.PackageList[0].Quantity"][0];
	//                 errorMsg += ++i + ". " + err + "\n";
	//             }
	//             if (error.data.ModelState["model.OrderCart.PackageList[0].Weight"]) {
	//                 var err = error.data.ModelState["model.OrderCart.PackageList[0].Weight"][0];
	//                 errorMsg += ++i + ". " + err + "\n";
	//             }
	//             if (error.data.ModelState["model.PaymentMethod"]) {
	//                 var err = error.data.ModelState["model.PaymentMethod"][0];
	//                 errorMsg += ++i + ". " + err + "\n";
	//             }
	//         }
	//         alert(errorMsg);
	// 	};

	// 	if (vm.isPutOrder) {
	// 		var requestMethod = "PUT";
	// 		var orderUrl = host + "api/job/"+ vm.jobId +"/order";
	// 		console.log(vm.jobId);
	// 		vm.order.OrderCart.TotalVATAmount = 0,
	// 		vm.order.OrderCart.SubTotal = 0,
	// 		vm.order.OrderCart.TotalToPay = 0
	// 		console.log(vm.order);
	// 		restCall(requestMethod, orderUrl, vm.order, successCallback, errorCallback);
	// 	} else {
	// 		var requestMethod = "POST";
	// 		var orderUrl = host + "api/Order/";
	// 		restCall(requestMethod, orderUrl, vm.order, successCallback, errorCallback);
	// 	}
	// }

	// function orderTypeSelected(type) {
	// 	vm.isOrderSelected = true;
	// 	if (type == "Ride") {
	// 		vm.RideOrderSelected = true;
	// 		vm.DeliveryOrderSelected = false;

	// 		vm.FromLabel = "User's Location";
	// 		vm.ToLabel = "User's Destination";
	// 	} else if ("Delivery") {
	// 		vm.RideOrderSelected = false;
	// 		vm.DeliveryOrderSelected = true;

	// 		vm.FromLabel = "Pick Up Location";
	// 		vm.ToLabel = "Delivery Location";
	// 	}
	// };

	// function getCurrentMarkerLocationCallback(lat, lng) {
	// 	vm.currentMarkerLocation.lat = lat;
	// 	vm.currentMarkerLocation.lng = lng;
	// 	console.log(lat + " " + lng)
	// }

	// // You should initialize the search box after creating the map, right?
	// function searchAddress() {
	// 	// mapFactory.searchBox(vm.toSearchText, getCurrentMarkerLocationCallback);
	// };


	// function setFromLocationCallback(lat, lng) {
	// 	console.log(lat + " " + lng)
	// 	vm.currentMarkerLocation.lat = lat;
	// 	vm.currentMarkerLocation.lng = lng;

	// 	vm.order.From.Point.coordinates = [];
	// 	vm.order.From.Point.coordinates.push(lng);
	// 	vm.order.From.Point.coordinates.push(lat);

	// 	// mapFactory.getAddress(lat, lng, function (address, latLng) {
	// 	// 	vm.order.From.AddressLine1 = address;
	// 	// });

	// 	$scope.$apply();
	// }

	// function setToLocationCallback(lat, lng) {
	// 	console.log(lat + " " + lng)
	// 	vm.currentMarkerLocation.lat = lat;
	// 	vm.currentMarkerLocation.lng = lng;

	// 	vm.order.To.Point.coordinates = [];
	// 	vm.order.To.Point.coordinates.push(lng);
	// 	vm.order.To.Point.coordinates.push(lat);

	// 	// mapFactory.getAddress(lat, lng, function (address, latLng) {
	// 	// 	vm.order.To.AddressLine1 = address;
	// 	// });
	// 	$scope.$apply();
	// }
};