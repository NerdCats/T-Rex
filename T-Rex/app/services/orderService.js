app.factory('orderFactory', ['$http', '$window', 'restCall', 'mapFactory', 'host', function($http, $window, restCall, mapFactory, host){
		
	var createNewOrder = function (newOrder, ordersIsBeingCreated) {
		ordersIsBeingCreated = true;
		var successCallback = function (response) {
			console.log("success : ");
			console.log(response);
			alert("success");
			$window.location.href = '#/';
		};
		
		var errorCallback = function error(response) {
			console.log("error : ");
			console.log(response);
			alert("error");
			ordersIsBeingCreated = false;
		};

		var createNewOrderUrl = host + "api/Order/";
		restCall('POST', createNewOrderUrl, newOrder, successCallback, errorCallback);
	};


	var newOrder =  {
						NoteToDeliveryMan : "",
					    RequiredChangeFor : 0.0,
					    Name : null,
					    From : {
							Address: "",
							PostalCode: null,
							Floor: null,
							HouseNumber: null,
							AddressLine1: "",
							AddressLine2: null,
							Country: null,
							City: "Dhaka",
							State: null,
							Locality: "",
							Point: {
							type: "Point",
							coordinates: null
							},
							Provider: "Default"
					    },
					    To: {
							Address: "",
							PostalCode: null,
							Floor: null,
							HouseNumber: null,
							AddressLine1: "",
							AddressLine2: null,
							Country: null,
							City: "Dhaka",
							State: null,
							Locality: "",
							Point: {
							type: "Point",
								"coordinates": null
							},
							Provider: "Default"
					    },
					    Type: "Delivery",
					    PayloadType: "default",
					    UserId: "",
					    OrderLocation: {
							Address: "",
							PostalCode: null,
							Floor: null,
							HouseNumber: null,
							AddressLine1: "",
							AddressLine2: null,
							Country: null,
							City: "Dhaka",
							State: null,
							Locality: "",
							Point: {
							type: "Point",
								"coordinates": null
							},
							Provider: "Default"
					    },
					    ETA: null,
					    ETAMinutes: null,
					    PaymentMethod: "CashOnDelivery",
					    Description: null,
					    OrderCart: {
					      PackageList: [
					        {
					          Item: null,
					          PicUrl: null,
					          Quantity: 0,
					          Price: 0.0,
					          VAT: 0.0,
					          Total: 0.0,
					          VATAmount: 0.0,
					          TotalPlusVAT: 0.0,
					          Weight: 0.0
					        }
					      ],
					      TotalVATAmount: 0.0,
					      SubTotal: 0.0,
					      ServiceCharge: 0.0,
					      TotalWeight: 0.0,
					      TotalToPay: 0.0
					    },
					    JobTaskETAPreference: []
					};	

	return {		
		createNewOrder : createNewOrder,
		newOrder: newOrder	
	}
}]);