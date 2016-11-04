// FIXME: someday, you should use http://oss.sheetjs.com/js-xlsx/

app.controller('bulkOrderC', ['$scope', 'bulkOrderService','ngAuthSettings', 'restCall', 'dashboardFactory', bulkOrderC]);

function bulkOrderC ($scope, bulkOrderService, ngAuthSettings, restCall, dashboardFactory) {
	
	var vm = $scope;
	// vm.EnterpriseUsers = [];
	vm.EnterpriseUser = null;
	vm.bulkOrder = bulkOrderService.getBulkOrder();	

	// vm.getUserNameList = function (type, Users) {
	// 	function success(response) {			
	// 		angular.forEach(response.data.data, function (value, keys) {
	// 			Users.push(value);
	// 		});			
	// 	}
	// 	function error(error) {
	// 		console.log(error);
	// 	}
	// 	var getUsersUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/odata?$filter=Type eq '"+ type +"'&PageSize=50";
	// 	restCall('GET', getUsersUrl, null, success, error);
	// }
	vm.bulkOrder.getUsersList("ENTERPRISE", vm.EnterpriseUsers);

	document.getElementById('csv').addEventListener('change', handleFile, false);
	function handleFile (e) {		
		var files = e.target.files;
		for (var i = 0, f = files[i]; i != files.length; ++i) {
			var reader = new FileReader();
		    var name = f.name;
		    reader.onload = function(e) {
		      	var data = e.target.result;
		      	var workbook = XLSX.read(data, {type: 'binary'});
		      	vm.bulkOrder.parseOrders(workbook);
		    }
		    reader.readAsBinaryString(f);
		}
	}

	vm.createAll = function () {
		angular.forEach(vm.bulkOrder.Orders, function (value, index) {
			console.log(value)
			value.createOrder();
		})
	}

	vm.upload = function () {}	
}