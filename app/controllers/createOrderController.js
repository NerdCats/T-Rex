(function () {

	'use strict';

	app.controller('createOrderController', createOrderController);

	function createOrderController($scope, $http, $window, ngAuthSettings, Areas, dashboardFactory, restCall, $rootScope, $routeParams, orderFactory, mapFactory){

		var vm = $scope;

		vm.OrderType = "";
		vm.VehiclePreference = ["CNG","SEDAN"];
		vm.LocalAreas = Areas;
		vm.LocalAreas.splice(0,1);

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
			vm.order = orderFactory.newOrder();
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
		// mapFactory.createMap(23.790888, 90.391430, 'orderCreateMap', 14);
		vm.searchAddress = searchAddress;
		// mapFactory.mapContextMenuForCreateOrder(setFromLocationCallback, setToLocationCallback);

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

		vm.loadUserNames = function (page) {
			vm.UserNameIsLoading = true;		
			var getUsersUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/odata?$filter=Type eq 'ENTERPRISE'&$orderby=UserName&page="+ page +"&pageSize=50";
			dashboardFactory.getUserNameList(getUsersUrl).then(function (response) {
				if (page === 0) {
					vm.userNames = [];					
				}
				angular.forEach(response.data, function (value, index) {
					vm.userNames.push(value);
				})
				if (response.pagination.TotalPages > page) {
					vm.loadUserNames(page + 1);
				}
				vm.UserNameIsLoading = false;
			}, function (error) {
				vm.UserNameIsLoading = false;
				console.log(error);
			});	
		};

		vm.loadUserNames(0);

		vm.onSelectUser = function ($item, $model, $label, $event) {
			vm.order.UserId = $item.Id;
			vm.order.SellerInfo.Name = $item.UserName;
			vm.order.SellerInfo.PhoneNumber = $item.PhoneNumber;
			vm.order.SellerInfo.Address.AddressLine1 = $item.UserName;
			vm.deliveryTypeChanged();
			console.log($item);
		}


		
		function createNewOrder() {

			if (vm.order.ReferenceInvoiceId) {			
				var newItem = {
		    		"Item": "Invoice No : " + vm.order.ReferenceInvoiceId,
					"Quantity": 1,
					"Price": 0,
					"VAT": 0,
					"Total": 0,
					"VATAmount": 0,
					"TotalPlusVAT": 0,
					"Weight": 0
		    	};
		    	vm.AddItem(newItem);
			}		
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
			
			if (vm.order.Type === "ClassifiedDelivery") {
				vm.order.SellerInfo.Address.AddressLine1 = vm.order.From.AddressLine1;
				vm.order.BuyerInfo.Address.AddressLine1 = vm.order.To.AddressLine1;

				vm.order.From.AddressLine1 = vm.order.SellerInfo.Name + ", \n" + vm.order.SellerInfo.PhoneNumber + " , \n"  + vm.order.SellerInfo.Address.AddressLine1;
				vm.order.To.AddressLine1 = vm.order.BuyerInfo.Name + ", \n" + vm.order.BuyerInfo.PhoneNumber + " , \n"  + vm.order.BuyerInfo.Address.AddressLine1;

				console.log(vm.order.From.AddressLine1)
				console.log(vm.order.To.AddressLine1)
			}
			
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
				vm.OrdersIsBeingCreated = false;
				console.log("error : ");
				console.log(error);
				vm.order.JobTaskETAPreference = [];
				vm.errorMsg = error.data.Message || "Server error";
				var i = 0;
		        if (error.data.ModelState) {
		            vm.errorMsg += "\n";
		            if (error.data.ModelState["model.From.AddressLine1"]) {
		                var err = error.data.ModelState["model.From.AddressLine1"][0];
		                vm.errorMsg += ++i + ". " + "Pickup Address is required" + "\n";
		            }
		            if (error.data.ModelState["model.To.AddressLine1"]) {
		                var err = error.data.ModelState["model.To.AddressLine1"][0];
		                vm.errorMsg += ++i + ". " + "Delivery Address is required" + "\n";
		            }
		            if (error.data.ModelState["model.OrderCart.PackageList[0].Item"]) {
		                var err = error.data.ModelState["model.OrderCart.PackageList[0].Item"][0];
		                vm.errorMsg += ++i + ". " + err + "\n";
		            }
		            if (error.data.ModelState["model.OrderCart.PackageList[0].Quantity"]) {
		                var err = error.data.ModelState["model.OrderCart.PackageList[0].Quantity"][0];
		                vm.errorMsg += ++i + ". " + err + "\n";
		            }
		            if (error.data.ModelState["model.OrderCart.PackageList[0].Weight"]) {
		                var err = error.data.ModelState["model.OrderCart.PackageList[0].Weight"][0];
		                vm.errorMsg += ++i + ". " + err + "\n";
		            }
		            if (error.data.ModelState["model.OrderCart.PackageList[0].Price"]) {
		                var err = error.data.ModelState["model.OrderCart.PackageList[0].Price"][0];
		                vm.errorMsg += ++i + ". " + err + "\n";
		            }
		            if (error.data.ModelState["model.PaymentMethod"]) {
		                var err = error.data.ModelState["model.PaymentMethod"][0];
		                vm.errorMsg += ++i + ". " + err + "\n";
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
				console.log(JSON.stringify(vm.order));			
			}
		};	


		vm.AddItem = function (item) {		
			if (item === undefined) {
				item = {
		    		"Item": "",
					"Quantity": 1,
					"Price": 0,
					"VAT": 0,
					"Total": 0,
					"VATAmount": 0,
					"TotalPlusVAT": 0,
					"Weight": 0
		    	};
		    	console.log(item)
			}

			vm.order.OrderCart.PackageList.push(item);
		}

		vm.RemoveItem = function (itemIndex) {
			console.log(itemIndex);
			vm.order.OrderCart.PackageList.splice(itemIndex, 1);		
		}

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
})();
