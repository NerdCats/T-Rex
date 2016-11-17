// FIXME: someday, you should use http://oss.sheetjs.com/js-xlsx/

app.controller('bulkOrderC', ['$scope', 'bulkOrderService','ngAuthSettings', 'restCall', 'dashboardFactory', bulkOrderC]);

function bulkOrderC ($scope, bulkOrderService, ngAuthSettings, restCall, dashboardFactory) {
	
	var vm = $scope;
	vm.EnterpriseUser = null;
	vm.bulkOrder = bulkOrderService.getBulkOrder();	


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