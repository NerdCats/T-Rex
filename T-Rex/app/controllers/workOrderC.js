app.controller('workOrderC', ['$scope', '$window', '$routeParams', '$uibModal', 'ngAuthSettings', 'restCall', 'dashboardFactory', workOrderC]);

function workOrderC($scope, $window, $routeParams, $uibModal, ngAuthSettings, restCall, dashboardFactory){
	var vm = $scope;	
	vm.WarningMessage = null;
	vm.User = {};
	vm.jobPerPage = 50;
	vm.workOrders = dashboardFactory.orders("IN_PROGRESS");	

	vm.openAssetsList = function (size) {
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'app/views/detailsJob/availableAsset.html',
			controller: 'ModalInstanceCtrl'
		});

		modalInstance.result.then(function (selectedItem) {				
				$window.location.href = "#/workorder?id=" + selectedItem.Id;
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
	};
	
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
		console.log(!$routeParams.id)
		console.log(!vm.WarningMessage)
		if (!$routeParams.id) {
			vm.WarningMessage = "Please select an Asset first!";			
		} else {
			vm.WarningMessage = null;
			vm.workOrders.searchParam.pageSize = vm.jobPerPage;
			vm.workOrders.isCompleted = 'IN_PROGRESS';
			vm.workOrders.searchParam.userId = $routeParams.id;
			vm.workOrders.loadOrders();
		}			
	}
	vm.activate();
}