app.controller('workOrderC', ['$scope', '$window', '$routeParams', '$uibModal', 'ngAuthSettings', 'restCall', 'dashboardFactory', workOrderC]);

function workOrderC($scope, $window, $routeParams, $uibModal, ngAuthSettings, restCall, dashboardFactory){
	var vm = $scope;	
	vm.WarningMessage = null;
	vm.selectedAssetId = $routeParams.id;
	vm.selectedAsset = null;
	vm.jobPerPage = 50;
	vm.Assets = [];
	vm.workOrders = dashboardFactory.orders("IN_PROGRESS");

	vm.totalSubTotal = 0;
	vm.totalServiceCharge = 0;
	vm.totalPayable = 0;

	vm.getAssetsList = function (page) {		
		var getUsersUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/odata?$filter=Type eq 'BIKE_MESSENGER'&$orderby=UserName&page="+ page +"&pageSize=50";
		dashboardFactory.getUserNameList(getUsersUrl).then(function (response) {
			if (page === 0) {
				vm.Assets = [];				
			}
			angular.forEach(response.data, function (value, index) {
				if ($routeParams.id && $routeParams.id === value.Id) {
					vm.selectedAsset = value;
				}
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
	
	vm.printWorkOrder = function () {
		$("#workOrders").print({
            globalStyles: true,
            mediaPrint: true,
            stylesheet: "node_modules/bootstrap/dist/css/bootstrap.css",
            noPrintSelector: ".no-print",
            iframe: true,
            append: null,
            prepend: null,
            manuallyCopyFormValues: true,
            deferred: $.Deferred(),
            timeout: 750,
            title: null,
            doctype: '<!doctype html>'
    	});		
	}

	vm.activate = function () {		
		if (!vm.selectedAssetId) {
			vm.WarningMessage = "Please select an Asset first!";			
		} else {
			vm.WarningMessage = null;
			vm.workOrders.searchParam.pageSize = vm.jobPerPage;
			vm.workOrders.isCompleted = 'IN_PROGRESS';
			vm.workOrders.searchParam.userId = vm.selectedAssetId;
			vm.workOrders.loadOrders();
		}
	}
	vm.assetChanged = function () {		
		angular.forEach(vm.Assets, function (asset, index) {			
			if (vm.selectedAssetId === asset.Id) {
				console.log("matched!")
				vm.selectedAsset = asset;
			}
		})
		vm.activate();
	}

	vm.deliveryTask = function () {
		var tempOrders = [];
		angular.forEach(vm.workOrders.data, function (job, index) {				
			vm.totalSubTotal += job.data.Order.OrderCart.SubTotal;
			vm.totalServiceCharge += job.data.Order.OrderCart.ServiceCharge;
			vm.totalPayable += job.data.Order.OrderCart.TotalToPay;

			if (vm.selectedAssetId === job.data.Tasks[2].AssetRef) {
				tempOrders.push(job);				
				console.log(job.data.Tasks[1].Type);
				console.log(vm.selectedAssetId);
				console.log(index+1);
			}
		})
		vm.workOrders.data = tempOrders;		
	}

	vm.$watch(function () {
		return vm.workOrders.data
	}, function (newVal, oldVal) {
		if (newVal !== oldVal) {			
			vm.totalSubTotal = 0;
			vm.totalServiceCharge = 0;
			vm.totalPayable = 0;
			var tempOrders = [];
			angular.forEach(newVal, function (job, index) {				
				vm.totalSubTotal += job.data.Order.OrderCart.SubTotal;
				vm.totalServiceCharge += job.data.Order.OrderCart.ServiceCharge;
				vm.totalPayable += job.data.Order.OrderCart.TotalToPay;

				vm.totalSubTotal += job.data.Order.OrderCart.SubTotal;
				vm.totalServiceCharge += job.data.Order.OrderCart.ServiceCharge;
				vm.totalPayable += job.data.Order.OrderCart.TotalToPay;

				if (vm.selectedAssetId === job.data.Tasks[2].AssetRef) {
					tempOrders.push(job);				
					console.log(job.data.Tasks[2].Type);
					console.log(vm.selectedAssetId);
					console.log(index+1);
				}
				console.log(newVal.data.length);
				newVal.data = tempOrders;	
				console.log(newVal.data.length);
			});			
		}
	})

	vm.activate();
}