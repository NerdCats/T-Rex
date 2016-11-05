app.factory('bulkOrderService', ['$http', 'ngAuthSettings', 'orderFactory', bulkOrderService])

function bulkOrderService($http, ngAuthSettings, orderFactory){	

	var getBulkOrder = function () {

		return {
			Orders: [],
			EnterpriseUser: null,
			EnterpriseUsers: [],
			getUsersList : function (type) {
				var getUsersUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/odata?$filter=Type eq '"+ type +"'&PageSize=50";
				var itSelf = this;

				$http({
					method: 'GET',
					url: getUsersUrl
				}).then(function (response) {
					angular.forEach(response.data.data, function (value, keys) {
						itSelf.EnterpriseUsers.push(value);
					});
				}, function (error) {
					console.log(error);
				})
			},
			createAll : function () {
				angular.forEach(this.Orders, function (value, index) {
					value.createOrder();
				});
			},

			parseOrders : function (workbook) {
				var result = {};
				var itSelf = this;
				workbook.SheetNames.forEach(function(sheetName) {
					var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
					if(roa.length > 0){
						result[sheetName] = roa;
					}
				});

				var orderInfos = result.OrderInfo;	   
			    angular.forEach(orderInfos, function (orderInfo, keys) {
			    	var order = orderFactory.newOrder();
			    	order.UserId = itSelf.EnterpriseUser.Id;
			    	
					order.SellerInfo.Name = itSelf.EnterpriseUser.UserName;
					order.SellerInfo.PhoneNumber = itSelf.EnterpriseUser.PhoneNumber;
					order.SellerInfo.Address.Locality = orderInfo["Pickup Area"];
					order.SellerInfo.Address.AddressLine1 = orderInfo["Pickup Address"];


					order.From.Locality = orderInfo["Pickup Area"];
					order.From.AddressLine1 = itSelf.EnterpriseUser.UserName + ", \n" + itSelf.EnterpriseUser.PhoneNumber + ", \n" + 
												orderInfo["Pickup Area"] + ", \n" +orderInfo["Pickup Address"];

					order.BuyerInfo.Name = orderInfo["Recipient's Name"];
					order.BuyerInfo.PhoneNumber = orderInfo["Recipient's PhoneNumber"];
					order.BuyerInfo.Address.Locality = orderInfo["Delivery Area"];
					order.BuyerInfo.Address.AddressLine1 = orderInfo["Delivery Address"];

					order.To.Locality = orderInfo["Delivery Area"];
					order.To.AddressLine1 = order.BuyerInfo.Name + ", \n" + order.BuyerInfo.PhoneNumber + ", \n" + 
															order.BuyerInfo.Address.Locality + ", \n" +orderInfo["Delivery Address"];

					order.Type = "ClassifiedDelivery";
					order.Variant = "Enterprise";

					order.OrderLocation = null;

					var product = "";
					if (orderInfo["Vendor's Invoice No"]) {
						product += "Invoice: " + orderInfo["Vendor's Invoice No"] + ", \n";
					}
					product += 	orderInfo["Product Description"];
					var newItem = {
					    		"Item": product,
								"Quantity": 1,
								"Price": orderInfo["Total Product Price (BDT)"],
								"VAT": 0,
								"Total": 0,
								"VATAmount": 0,
								"TotalPlusVAT": 0,
								"Weight": orderInfo["Total Weight (KG)"]
					    	};
			    	order.OrderCart.PackageList.push(newItem);
			    	order.NoteToDeliveryMan = orderInfo["Special Instructions"]

			    	order.HRID = "";

			    	order.Status = '';
			    	order.createOrder = function () {
			    		order.Status = 'POSTING';
			    		$http({
			    			method: 'POST',
			    			url: ngAuthSettings.apiServiceBaseUri + "api/Order/",
			    			data: order
			    		}).then(function (response) {
			    			order.HRID = response.data.HRID
			    			order.Status = 'SUCCEEDED';
			    		}, function (error) {
			    			console.log(error);
			    			order.Status = 'FAILED';
			    			alert("Couldn't create the order " + error.Message)
			    		})
			    	}

			    	itSelf.Orders.push(order);
			    })
			    // console.log(JSON.stringify(this.Orders[0]))
			    console.log(this)
			}
		}
	}

	return {
		getBulkOrder: getBulkOrder
	};
}