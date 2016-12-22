app.controller('bulkAssignC', bulkAssignC);

function bulkAssignC($scope, $http, ngAuthSettings, dashboardFactory){
	var vm = $scope;
	vm.listOfHRID = [];
	vm.Assets = [];
	vm.selectedAssetId = null;
	vm.EnterpriseUser = null;
	vm.PaymentStatus = null;	
	vm.DeliveryArea = null;
	vm.searchKey = null;
	vm.Orders = dashboardFactory.orders(null);	

	vm.Orders.assign.showPickupAssign = true;
	vm.Orders.assign.showdeliveryAssign = true;
	vm.Orders.assign.showsecuredeliveryAssign = true;
	vm.Orders.searchParam.jobState === 'IN_PROGRESS';


	vm.assetChanged = function () {		
		vm.Orders.assign.assetRef = vm.selectedAssetId;
	}
	vm.getAssetsList = function (page) {		
		var getUsersUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/odata?$filter=Type eq 'BIKE_MESSENGER'&$orderby=UserName&page="+ page +"&pageSize=50";
		dashboardFactory.getUserNameList(getUsersUrl).then(function (response) {
			if (page === 0) {
				vm.Assets = [];
				vm.Assets.push(null);
			}
			angular.forEach(response.data, function (value, index) {
				vm.Assets.push(value);
			})
			if (response.pagination.TotalPages > page) {
				vm.getAssetsList(page + 1);
			}			
		}, function (error) {
			console.log(error);
		});
	};

	vm.getAssetsList();

	vm.activate = function () {
		vm.Orders.searchParam.UserName = vm.EnterpriseUser;
		vm.Orders.searchParam.PaymentStatus = vm.PaymentStatus;
		vm.Orders.searchParam.pageSize = vm.jobPerPage;
		vm.Orders.searchParam.DeliveryArea = vm.DeliveryArea;
		vm.Orders.searchParam.subStringOf.SearchKey = vm.searchKey;
		vm.Orders.searchParam.orderby.property = "ModifiedTime";
		vm.Orders.isCompleted = 'IN_PROGRESS';			
		vm.Orders.loadOrders();
	}

	vm.$watch(function () {
		return vm.listOfHRID;
	}, function (newVal, oldVal) {
		if (newVal.length === 0) {
			vm.activate();
		}
		if (newVal != oldVal) {
			vm.Orders.pagination = null;
			vm.Orders.pages = null;
			vm.Orders.loadListOfOrders(newVal);
		}
	})
}