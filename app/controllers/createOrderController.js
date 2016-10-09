'use strict';

app.controller('createOrderController', ['$scope', '$http', '$window', 'ngAuthSettings', 'UrlPath', 'restCall', '$rootScope',  '$routeParams', 'orderFactory', 'mapFactory', createOrderController]);

function createOrderController($scope, $http, $window, ngAuthSettings, UrlPath, restCall, $rootScope, $routeParams, orderFactory, mapFactory){

	var vm = $scope;

	vm.OrderType = "";
	vm.VehiclePreference = ["CNG","SEDAN"];
	vm.LocalAreas = ["","Outside Dhaka","Adabor","Agargaon","Azimpur","Badda","Bailey Road","Banani",
					"Banani DOHS","Banasree","Bangla Motor","Baridhara","Baridhara Block-J","Baridhara Diplomatic",
					"Baridhara DOHS","Basabo","Bashundhara","Bashundhara R/A","Bassabo","Basundhara","Cantonment",
					"Chowdhurypara","Dhanmondi","Dhanmondi R/A","DOHS","Elephant Road","Eskaton","Farmgate","Gabtoli",
					"Goran","Green road","Gulshan","Gulshan 1","Gulshan 2","Hatirpul Residential Area","Indira Road",
					"Kakrail","Kalabagan","Khilgaon","Khilgaon-taltola","Khilkhet","Lalmatia","Kallyanpur","Malibag",
					"Katabon","Malibagh","Mirpur","Mirpur 1","Mirpur 2","Mirpur DOHS","Mirpur 10","Mirpur 11","Mirpur 12",
					"Mirpur 13","Mirpur 14","Mirpur 6","Mirpur 7","Pallabi","Moghbazaar","Moghbazar","Mohakhali","Mohakhali DOHS",
					"Mohammadpur","Motijheel","Narinda","Niketan","Nikunja","Nikunja 1","Nikunja 2","Paikpara","Paltan",
					"Panthapath","Paribagh","Rajarbag","Ramna","Rampura","Segunbagicha","Shahbagh","Shahjadpur","Shantinagar",
					"Shaymoli","Shegunbagicha","Shipahibag bazar","Shyamoli","Siddeshari","Siddeshwari","Sonargaon Road","Tejgaon",
					"Tejgaon Industrial Area","Tikatuli","Tnt colony","Tongi","Uttara","Wari"];

	vm.PackagePickUp = {
		Type: "PackagePickUp",
		ETA: null
	}

	vm.Delivery = {
		Type: "Delivery",
	    ETA: null
	}

	vm.PaymentMethod = [];
	vm.placesResults = [];

	vm.SelectedTo = "";
	
  	vm.OrderIsLoading = false;
  	vm.OrdersIsBeingCreated = false;
  	vm.OrderFailed = false;
  	vm.UserNameIsLoading = false;

  	vm.buttonText = "Create Order";
  	vm.minMode = true;

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
		var jobUrl = ngAuthSettings.apiServiceBaseUri + "/api/job/" + vm.id;
		vm.OrderIsLoading = true;
		vm.buttonText = "Update"
		var successCallback = function(response){
			vm.order = response.data.Order;
			vm.jobId = response.data.Id;
			vm.HRID = response.data.HRID;
			vm.isPutOrder = true;
			vm.OrderIsLoading = false;			
		}
		var errorCallback = function(responese){
			console.log(responese);
			vm.OrderIsLoading = false;
			vm.OrderFailed = true;
			alert("No Job Found!!!");
		}
		restCall("GET", jobUrl, null, successCallback, errorCallback);
	}


	vm.createNewOrder = createNewOrder;
	vm.currentMarkerLocation = {lat:0,lng:0};
	mapFactory.createMap(23.790888, 90.391430, 'orderCreateMap', 14);
	vm.searchAddress = searchAddress;
	mapFactory.mapContextMenuForCreateOrder(setFromLocationCallback, setToLocationCallback);

	vm.deliveryTypeChanged = function () {
		if (vm.OrderType === "B2CDelivery" || vm.OrderType === "B2BDelivery") {
			vm.order.Type = "ClassifiedDelivery";
			vm.order.Variant = "Enterprise";
		} else if (vm.OrderType === "ClassifiedDelivery") {
			vm.order.Type = "ClassifiedDelivery";
			vm.order.Variant = "default";
		}
		if (vm.OrderType === "B2CDelivery" || vm.OrderType === "ClassifiedDelivery") {
			vm.order.SellerInfo.Name = "";
			vm.order.SellerInfo.PhoneNumber = "";
			vm.order.SellerInfo.Address.AddressLine1 = "";
		}
		console.log(vm.order.Type + "  " + vm.order.Variant );
	}
	vm.loadUserNames = function (){
		function successCallback(response) {
			vm.userNames = response.data.data;
			vm.UserNameIsLoading = false;
			console.log(vm.userNames)
		}
		function errorCallback(error) {
			console.log(error);
			vm.UserNameIsLoading = false;
		}
		vm.UserNameIsLoading = true;
		var query = vm.selectedUser;
		var getUsersUrl = ngAuthSettings.apiServiceBaseUri + "api/account/odata?" + "$filter=Type eq 'ENTERPRISE'" + "&envelope=" + true + "&page=" + 0 + "&pageSize=" + 50;
		console.log(getUsersUrl)
		restCall('GET', getUsersUrl, null, successCallback, errorCallback)		
	};

	vm.loadUserNames();

	vm.onSelectUser = function ($item, $model, $label, $event) {
		console.log($item);
		vm.order.UserId = $item.Id;
		vm.order.SellerInfo.Name = $item.UserName;
		vm.order.SellerInfo.PhoneNumber = $item.PhoneNumber;
		vm.order.SellerInfo.Address.AddressLine1 = $item.UserName;

		vm.deliveryTypeChanged();
	}


	
	function createNewOrder() {
		
		if (vm.PackagePickUp.ETA) {
			var ETA = {				
				Type: "PackagePickUp",
				ETA: new Date(vm.PackagePickUp.ETA)
		    }
			vm.order.JobTaskETAPreference.push(ETA);
		}

		if (vm.Delivery.ETA) {
			var ETA = {				
				Type: "Delivery",
				ETA: new Date(vm.Delivery.ETA)
		    }			
			vm.order.JobTaskETAPreference.push(ETA);
		}

		if (vm.order.ETA) {
			vm.order.ETA = new Date(vm.order.ETA);			
		}

		console.log(vm.order)
		if (vm.order.OrderLocation && (vm.order.OrderLocation.AddressLine1 === null || vm.order.OrderLocation.AddressLine1 === "")) {
			vm.order.OrderLocation = null;
		}

		vm.order.From.AddressLine1 = vm.order.SellerInfo.Name + ", \n" + vm.order.SellerInfo.PhoneNumber + " , \n"  + vm.order.SellerInfo.Address.AddressLine1;
		vm.order.To.AddressLine1 = vm.order.BuyerInfo.Name + ", \n" + vm.order.BuyerInfo.PhoneNumber + " , \n"  + vm.order.BuyerInfo.Address.AddressLine1;
		
		console.log(vm.order);
		vm.OrdersIsBeingCreated = true;
		vm.OrderFailed = false;
		var successCallback = function (response){
			vm.OrdersIsBeingCreated = false;
			if (vm.isPutOrder) {
				$window.location.href = '#/job/' + vm.HRID;
			} else {
				vm.HRID = response.data.HRID;
				$window.location.href = '#/job/' + vm.HRID;
			}
		}

		var errorCallback = function error(error) {
			vm.OrderFailed = true;
			console.log("error : ");
			console.log(error);
			vm.order.JobTaskETAPreference = [];
			vm.OrdersIsBeingCreated = false;

			vm.errorMsg = error.data.Message || "Server error";
			var i = 0;
	        if (error.data.ModelState) {
	            vm.errorMsg += "\n";
	            if (error.data.ModelState["model.From.AddressLine1"]) {
	                var err = error.data.ModelState["model.From.AddressLine1"][0];
	                errorMsg += ++i + ". " + "Pickup Address is required" + "\n";
	            }
	            if (error.data.ModelState["model.To.AddressLine1"]) {
	                var err = error.data.ModelState["model.To.AddressLine1"][0];
	                errorMsg += ++i + ". " + "Delivery Address is required" + "\n";
	            }
	            if (error.data.ModelState["model.OrderCart.PackageList[0].Item"]) {
	                var err = error.data.ModelState["model.OrderCart.PackageList[0].Item"][0];
	                errorMsg += ++i + ". " + err + "\n";
	            }
	            if (error.data.ModelState["model.OrderCart.PackageList[0].Quantity"]) {
	                var err = error.data.ModelState["model.OrderCart.PackageList[0].Quantity"][0];
	                errorMsg += ++i + ". " + err + "\n";
	            }
	            if (error.data.ModelState["model.OrderCart.PackageList[0].Weight"]) {
	                var err = error.data.ModelState["model.OrderCart.PackageList[0].Weight"][0];
	                errorMsg += ++i + ". " + err + "\n";
	            }
	            if (error.data.ModelState["model.PaymentMethod"]) {
	                var err = error.data.ModelState["model.PaymentMethod"][0];
	                errorMsg += ++i + ". " + err + "\n";
	            }
	        }
	        
		};
		if (vm.isPutOrder) {
			var requestMethod = "PUT";
			var orderUrl = ngAuthSettings.apiServiceBaseUri + "api/job/"+ vm.jobId +"/order";
			console.log(vm.jobId);
			vm.order.OrderCart.TotalVATAmount = 0;
			vm.order.OrderCart.SubTotal = 0;
			vm.order.OrderCart.TotalToPay = 0;			
			restCall(requestMethod, orderUrl, vm.order, successCallback, errorCallback);
		} else {			
			var requestMethod = "POST";
			var orderUrl = ngAuthSettings.apiServiceBaseUri + "api/Order/";
			restCall(requestMethod, orderUrl, vm.order, successCallback, errorCallback);
			console.log(vm.order);			
		}
	};
	
	loadPaymentMethods();

	vm.AddItem = AddItem;
	vm.RemoveItem = RemoveItem;

	function AddItem() {
		var newItem = {
    		"Item": "",
			"Quantity": 1,
			"Price": 0,
			"VAT": 0,
			"Total": 0,
			"VATAmount": 0,
			"TotalPlusVAT": 0,
			"Weight": 0
    	};

		vm.order.OrderCart.PackageList.push(newItem);		
	}

	function RemoveItem(itemIndex) {
		console.log(itemIndex);
		vm.order.OrderCart.PackageList.splice(itemIndex, 1);		
	}


	

	function loadPaymentMethods() {
		// function successCallback(response) {
		// 	var paymentMethod = response.data;
		// 	angular.forEach(paymentMethod, function (value, key) {
		// 		 vm.PaymentMethod.push(value.Key);
		// 	})

		// 	console.log(vm.PaymentMethod)
		// }
		// function errorCallback(error) {
		// 	console.log(error);
		// }
		// restCall('GET', ngAuthSettings.apiServiceBaseUri + "/api/Payment", null, successCallback, errorCallback)
		vm.PaymentMethod.push("CashOnDelivery");
	};


 
	



 

	function getCurrentMarkerLocationCallback(lat, lng) {
		vm.currentMarkerLocation.lat = lat;
		vm.currentMarkerLocation.lng = lng;
		console.log(lat + " " + lng)
	}

	function getPlacesResultCallback(placesResults, status) {
		vm.placesResults = placesResults;
		console.log(vm.placesResults)
	}

	// // You should initialize the search box after creating the map, right?
	function searchAddress() {
		mapFactory.searchBox(vm.toSearchText, getPlacesResultCallback);
	};

	vm.onSelectPlace = function ($item, $model, $label, $event) {
		console.log($item)
		mapFactory.setCenterByAddress($item.description, getCurrentMarkerLocationCallback);
	}

	function setFromLocationCallback(lat, lng) {
		console.log(lat + " " + lng)
		vm.currentMarkerLocation.lat = lat;
		vm.currentMarkerLocation.lng = lng;

		vm.order.From.Point.coordinates = [];
		vm.order.From.Point.coordinates.push(lng);
		vm.order.From.Point.coordinates.push(lat);

		// mapFactory.getAddress(lat, lng, function (address, latLng) {
		// 	vm.order.From.AddressLine1 = address;
		// });

		$scope.$apply();
	}

	function setToLocationCallback(lat, lng) {
		console.log(lat + " " + lng)
		vm.currentMarkerLocation.lat = lat;
		vm.currentMarkerLocation.lng = lng;

		vm.order.To.Point.coordinates = [];
		vm.order.To.Point.coordinates.push(lng);
		vm.order.To.Point.coordinates.push(lat);

		// mapFactory.getAddress(lat, lng, function (address, latLng) {
		// 	vm.order.To.AddressLine1 = address;
		// });
		$scope.$apply();
	}
};