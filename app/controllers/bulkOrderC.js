// FIXME: someday, you should use http://oss.sheetjs.com/js-xlsx/

app.controller('bulkOrderC', ['$scope', 'orderFactory', 'ngAuthSettings', 'restCall', 'dashboardFactory', bulkOrderC]);

function bulkOrderC ($scope, orderFactory, ngAuthSettings, restCall, dashboardFactory) {
	
	var vm = $scope;
	vm.EnterpriseUsers = [];
	vm.EnterpriseUser = null;
	vm.Orders = [];	

	vm.getUserNameList = function (type, Users) {
		function success(response) {			
			angular.forEach(response.data.data, function (value, keys) {
				Users.push(value);
			});			
		}
		function error(error) {
			console.log(error);
		}
		var getUsersUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/odata?$filter=Type eq '"+ type +"'&PageSize=50";
		restCall('GET', getUsersUrl, null, success, error);
	}
	vm.getUserNameList("ENTERPRISE", vm.EnterpriseUsers);

	document.getElementById('csv').addEventListener('change', handleFile, false);
	function handleFile (e) {		
		var files = e.target.files;
		for (i = 0, f = files[i]; i != files.length; ++i) {
			var reader = new FileReader();
		    var name = f.name;
		    reader.onload = function(e) {
		      	var data = e.target.result;
		      	var workbook = XLSX.read(data, {type: 'binary'});
		       	
		      	var json = vm.excelToJson(workbook);
		      	vm.parseOrders(json)
		    }
		    reader.readAsBinaryString(f);
		}
	}

	

	vm.excelToJson = function (workbook) {
		var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
			if(roa.length > 0){
				result[sheetName] = roa;
			}
		});
		return result;
	}


	 

	vm.parseOrders = function (json) {
	    var orderInfos = json.OrderInfo;	   
	    angular.forEach(orderInfos, function (orderInfo, keys) {
	    	var order = orderFactory.newOrder();
	    	order.UserId = vm.EnterpriseUser.Id;
	    	
			order.SellerInfo.Name = vm.EnterpriseUser.UserName;
			order.SellerInfo.PhoneNumber = vm.EnterpriseUser.PhoneNumber;
			order.SellerInfo.Address.Locality = orderInfo["Pickup Area"];
			order.SellerInfo.Address.AddressLine1 = orderInfo["Pickup Address"];


			order.From.Locality = orderInfo["Pickup Area"];
			order.From.AddressLine1 = orderInfo["Pickup Address"];

			order.BuyerInfo.Name = orderInfo["Recipient's Name"];
			order.BuyerInfo.PhoneNumber = orderInfo["Recipient's PhoneNumber"];
			order.BuyerInfo.Address.Locality = orderInfo["Delivery Area"];
			order.BuyerInfo.Address.AddressLine1 = orderInfo["Delivery Address"];

			order.To.Locality = orderInfo["Delivery Area"];
			order.To.AddressLine1 = orderInfo["Delivery Address"];

			order.Type = "ClassifiedDelivery";
			order.Variant = "Enterprise";

			order.OrderLocation = null;

			var product = "";
			if (orderInfo["Vendor's Invoice No"]) {
				product += "Invoice: " + orderInfo["Vendor's Invoice No"];
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

	    	vm.Orders.push(order);

	    	order = null;
	    })


	    console.log(JSON.stringify(vm.Orders));

	    // angular.forEach(vm.Orders, function(jobs) {	      		      	
	    //   	obj.push({
		   //      jobid: o[0],
		   //      userid: vm.EnterpriseUser.Id,
		   //      pickuparea: o[2],
		   //      pickupaddress: o[3],
		   //      deliveryarea: o[4],
		   //      deliveryaddress: o[5],
		   //      packagedetails: o[6],
		   //      totalweight: o[7],
		   //      totalprice: o[8],
		   //      servicecharge: o[9],
		   //      notetodeliveryman : o[10],
		   //      editMode: false,
		   //      creatingOrder: 'PENDING',
		   //      createOrder: function () {
		   //      	var order = orderFactory.newOrder;
		   //      	order.NoteToDeliveryMan = this.notetodeliveryman;
		   //      	order.From.AddressLine1 = this.pickupaddress;
					// order.From.Locality = this.pickuparea;
					// order.To.AddressLine1 = this.deliveryaddress;
					// order.To.Locality = this.deliveryarea;
					// order.OrderLocation = null;
					// order.UserId = this.userid;
					// order.Description = this.packagedetails + "\nTotal Price : " + this.totalprice + "\nTotal Weight : " + (this.totalweight || "Not Mentioned");
					// var newItem = {
			  //   		"Item": "mdon",
					// 	"Quantity": 1,
					// 	"Price": 0,
					// 	"VAT": 0,
					// 	"Total": 0,
					// 	"VATAmount": 0,
					// 	"TotalPlusVAT": 0,
					// 	"Weight": 0
			  //   	};
			  //   	order.OrderCart.PackageList.push(newItem);
					// order.OrderCart.PackageList[0].Item = this.packagedetails;
					// order.OrderCart.PackageList[0].Price = this.totalprice;
					// order.OrderCart.PackageList[0].Weight = (this.totalweight || 0);
					// order.OrderCart.ServiceCharge = this.servicecharge;

					// this.creatingOrder = 'IN_PROGRESS';					
					// var itself = this;
					// var successCallback = function (response) {
					// 	console.log("success : ");
					// 	console.log(response);					
					// 	itself.creatingOrder = 'SUCCESS';
					// 	itself.jobid = response.data.HRID;
					// };
					
					// var errorCallback = function error(response) {
					// 	console.log("error : ");
					// 	console.log(response);						
					// 	itself.creatingOrder = 'PENDING';
					// };

					// var createNewOrderUrl = ngAuthSettings.apiServiceBaseUri + "api/Order/";
					// restCall('POST', createNewOrderUrl, order, successCallback, errorCallback);
		   //      }
		   //  });
	    // });
	    // return obj;
	};

	vm.createAll = function () {
		angular.forEach(vm.CSV, function (value, index) {
			value.createOrder();
		});
	}
}