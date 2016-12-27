app.controller('bulkAssignC', bulkAssignC);

function bulkAssignC($scope, $http, ngAuthSettings, Areas, dashboardFactory){
	var vm = $scope;
	vm.listOfHRID = [];
	vm.Assets = [];
	vm.selectedAssetId = null;
	vm.EnterpriseUser = null;
	vm.PaymentStatus = null;	
	vm.DeliveryArea = null;
	vm.jobPerPage = 50;
	vm.startDate = undefined;
	vm.endDate = undefined;
	vm.searchKey = null;
	vm.Orders = dashboardFactory.orders(null);

	vm.Orders.searchParam.jobState === 'IN_PROGRESS';

	vm.DeliveryAreas = Areas;

	vm.assetChanged = function () {		
		vm.Orders.assign.showPickupAssign = true;
		vm.Orders.assign.showdeliveryAssign = true;
		vm.Orders.assign.showsecuredeliveryAssign = true;
		
		vm.Orders.assign.assetRef = vm.selectedAssetId;
	}

	vm.getEnterpriseUsersList = function (page) {
		console.log("EnterpriseUsers");
		var getUsersUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/odata?$filter=Type eq 'ENTERPRISE'&$orderby=UserName&page="+ page +"&pageSize=50&$select=UserName";
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

	vm.getAssetsList(0);
	vm.getEnterpriseUsersList(0);


	vm.setDate = function () {
		var startDateISO = undefined;
		var endDateISO = undefined;
		
		if (vm.startDate&&vm.endDate) {
			startDateISO = dashboardFactory.getIsoDate(vm.startDate,0,0,0);			
			endDateISO = dashboardFactory.getIsoDate(vm.endDate,23,59,59);			
		}

		vm.Orders.searchParam.CreateTime.startDate = startDateISO;
		vm.Orders.searchParam.CreateTime.endDate = endDateISO;
	}

	vm.clearDate = function () {
		vm.startDate = undefined;		
		vm.endDate = undefined;
		vm.activate();
	}

	vm.activate = function () {
		vm.setDate();
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