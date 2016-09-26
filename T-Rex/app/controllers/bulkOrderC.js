// FIXME: someday, you should use http://oss.sheetjs.com/js-xlsx/

app.controller('bulkOrderC', ['$scope', 'orderFactory', 'ngAuthSettings', 'restCall', bulkOrderC]);

function bulkOrderC ($scope, orderFactory, ngAuthSettings, restCall) {
	
	var vm = $scope;	
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

	vm.readCSV = function (input) {
	    var rows = input.split('\n');
	    var obj = [];
	    angular.forEach(rows, function(val) {
	      	var o = val.split(';');
	      	obj.push({
		        jobid: o[0],
		        userid: o[1],
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

					this.creatingOrder = 'IN_PROGRESS';
					console.log(this.creatingOrder);
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