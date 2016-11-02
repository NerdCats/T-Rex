// FIXME: someday, you should use http://oss.sheetjs.com/js-xlsx/

app.controller('bulkOrderC', ['$scope', 'orderFactory', 'ngAuthSettings', 'restCall', 'dashboardFactory', bulkOrderC]);

function bulkOrderC ($scope, orderFactory, ngAuthSettings, restCall, dashboardFactory) {
	
	var vm = $scope;
	vm.EnterpriseUsers = [];
	vm.EnterpriseUser = null;	

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
		var f = files[0];
		console.log(f)

		 var r = new FileReader();
          r.onload = function(e) {
              var contents = e.target.result;              
              vm.CSV = vm.readCSV(contents);
              vm.$apply();
              console.log(vm.CSV);
          };
          r.readAsText(files[0]);
	}

	vm.createAll = function () {
		angular.forEach(vm.CSV, function (value, index) {
			value.createOrder();
		});
	}

	vm.readCSV = function (input) {
	    var rows = input.split('\n');
	    var obj = [];
	    angular.forEach(rows, function(val) {
	      	var o = val.split(';');
	      	console.log(vm.EnterpriseUser)
	      	obj.push({
		        jobid: o[0],
		        userid: vm.EnterpriseUser.Id,
		        pickuparea: o[2],
		        pickupaddress: o[3],
		        deliveryarea: o[4],
		        deliveryaddress: o[5],
		        packagedetails: o[6],
		        totalweight: o[7],
		        totalprice: o[8],
		        servicecharge: o[9],
		        notetodeliveryman : o[10],
		        editMode: false,
		        creatingOrder: 'PENDING',
		        createOrder: function () {
		        	var order = orderFactory.newOrder;
		        	order.NoteToDeliveryMan = this.notetodeliveryman;
		        	order.From.AddressLine1 = this.pickupaddress;
					order.From.Locality = this.pickuparea;
					order.To.AddressLine1 = this.deliveryaddress;
					order.To.Locality = this.deliveryarea;
					order.OrderLocation = null;
					order.UserId = this.userid;
					order.Description = this.packagedetails + "\nTotal Price : " + this.totalprice + "\nTotal Weight : " + (this.totalweight || "Not Mentioned");
					var newItem = {
			    		"Item": "mdon",
						"Quantity": 1,
						"Price": 0,
						"VAT": 0,
						"Total": 0,
						"VATAmount": 0,
						"TotalPlusVAT": 0,
						"Weight": 0
			    	};
			    	order.OrderCart.PackageList.push(newItem);
					order.OrderCart.PackageList[0].Item = this.packagedetails;
					order.OrderCart.PackageList[0].Price = this.totalprice;
					order.OrderCart.PackageList[0].Weight = (this.totalweight || 0);
					order.OrderCart.ServiceCharge = this.servicecharge;

					this.creatingOrder = 'IN_PROGRESS';					
					var itself = this;
					var successCallback = function (response) {
						console.log("success : ");
						console.log(response);					
						itself.creatingOrder = 'SUCCESS';
						itself.jobid = response.data.HRID;
					};
					
					var errorCallback = function error(response) {
						console.log("error : ");
						console.log(response);						
						itself.creatingOrder = 'PENDING';
					};

					var createNewOrderUrl = ngAuthSettings.apiServiceBaseUri + "api/Order/";
					restCall('POST', createNewOrderUrl, order, successCallback, errorCallback);
		        }
		    });
	    });
	    return obj;
	};
}