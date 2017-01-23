// FIXME: someday, you should use http://oss.sheetjs.com/js-xlsx/

app.controller('bulkOrderC', ['$scope', 'bulkOrderService','ngAuthSettings', 'restCall', 'dashboardFactory', bulkOrderC]);

function bulkOrderC ($scope, bulkOrderService, ngAuthSettings, restCall, dashboardFactory) {
	
	var vm = $scope;	
	vm.EnterpriseUsers = [];
	vm.isUploaded = false;
	vm.bulkOrder = bulkOrderService.getBulkOrder();		

	vm.getEnterpriseUsersList = function (page) {		
		var getUsersUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/odata?$filter=Type eq 'ENTERPRISE'&$orderby=UserName&page="+ page +"&pageSize=50";
		dashboardFactory.getUserNameList(getUsersUrl).then(function (response) {
			if (page === 0) {
				vm.EnterpriseUsers = [];
				vm.EnterpriseUsers.push({ UserName : "All" });			
			}
			angular.forEach(response.data, function (value, index) {
				vm.EnterpriseUsers.push(value);
			})
			if (response.pagination.TotalPages > page) {
				vm.getEnterpriseUsersList(page + 1);
			}			
		}, function (error) {
			console.log(error);
		});
	}

	vm.getEnterpriseUsersList(0);

	vm.onSelectUser = function ($item, $model, $label, $event){		
		vm.bulkOrder.EnterpriseUser = $item;		
	}

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

	vm.upload = function () {
		vm.isUploaded = true;
	}
}