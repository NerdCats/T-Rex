app.factory('orderFactory', ['$http', '$window', 'restCall', 'mapFactory', 'ngAuthSettings', function($http, $window, restCall, mapFactory, ngAuthSettings){
		
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
					    Variant: "default",
					    PayloadType: "default",
					    UserId: "",
					    OrderLocation: {
							Address: "",
							PostalCode: null,
							Floor: null,
							HouseNumber: null,
							AddressLine1: null,
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
					    BuyerInfo: {
					      	Name: null,
					      	PhoneNumber: null,
					      	UserRef: null,
					      	Address: {
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
					    },
					    SellerInfo: {
					      	Name: null,
					      	PhoneNumber: null,
					      	UserRef: null,
					      	Address: {
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
					    },
					    ETA: null,
					    ETAMinutes: null,
					    PaymentMethod: "CashOnDelivery",
					    Description: null,
					    OrderCart: {
					      PackageList: [],
					      TotalVATAmount: 0.0,
					      SubTotal: 0.0,
					      ServiceCharge: 0.0,
					      TotalWeight: 0.0,
					      TotalToPay: 0.0
					    },
					    JobTaskETAPreference: []
					};	

	return {		
		newOrder: newOrder	
	}
}]);