'use strict';

app.controller('dashBoardController', ['$scope', '$interval', '$window', 'Areas', 'ngAuthSettings', 'timeAgo', 'restCall', 'dashboardFactory', dashBoardController]);

function dashBoardController($scope, $interval, $window, Areas, ngAuthSettings, timeAgo, restCall, dashboardFactory)  {

	var vm = $scope;	
	vm.autoRefreshState = true;

	vm.DeliveryAreas = Areas;	
	vm.EnterpriseUsers = [];	

	vm.Orders = dashboardFactory.orders(null);	
	vm.SelectedState = null;
	vm.SelectDateRange = {startDate: null, endDate: null};
	vm.SearchKey = null;
	vm.EnterpriseUser = null;
	vm.DeliveryArea = null;
	vm.PaymentStatus = null;
	vm.AttemptCount = null;
	vm.JobsPerPage = 50;
	vm.OrderByProperty = "ModifiedTime";
	vm.OrderByPropertyDirection = "desc";
	vm.SelectedTimeProperty = null;
	vm.SelectedOrderByProperty = null;

	vm.onSelectUser = function ($item, $model, $label, $event){		
		vm.EnterpriseUser = $item.UserName;		
		console.log($item);
	}


	vm.selectDateRange = function () {
		if (vm.SelectDateRange.startDate && vm.SelectDateRange.endDate) {
			vm.dateRange1 = vm.SelectDateRange.startDate._d.toISOString();
			vm.dateRange2 = vm.SelectDateRange.endDate._d.toISOString();			
			console.log(vm.dateRange1);
			console.log(vm.dateRange2);
			switch(vm.SelectedTimeProperty){
				case "CreateTime":
					vm.Orders.searchParam.CreateTime.startDate = vm.dateRange1;
					vm.Orders.searchParam.CreateTime.endDate = vm.dateRange2;

					vm.Orders.searchParam.CompletionTime.startDate = null;
					vm.Orders.searchParam.CompletionTime.endDate = null;
					vm.Orders.searchParam.ModifiedTime.startDate = null;
					vm.Orders.searchParam.ModifiedTime.endDate = null;
					break;
				case "CompletionTime":
					vm.Orders.searchParam.CompletionTime.startDate = vm.dateRange1;
					vm.Orders.searchParam.CompletionTime.endDate = vm.dateRange2;

					vm.Orders.searchParam.CreateTime.startDate = null;
					vm.Orders.searchParam.CreateTime.endDate = null;
					vm.Orders.searchParam.ModifiedTime.startDate = null;
					vm.Orders.searchParam.ModifiedTime.endDate = null;
					break;
				case "ModifiedTime":
					vm.Orders.searchParam.ModifiedTime.startDate = vm.dateRange1;
					vm.Orders.searchParam.ModifiedTime.endDate = vm.dateRange2;

					vm.Orders.searchParam.CreateTime.startDate = null;
					vm.Orders.searchParam.CreateTime.endDate = null;
					vm.Orders.searchParam.CompletionTime.startDate = null;
					vm.Orders.searchParam.CompletionTime.endDate = null;
					break;
				default:
					break;
			}
		} else {
			vm.Orders.searchParam.ModifiedTime.startDate = null;
			vm.Orders.searchParam.ModifiedTime.endDate = null;
			vm.Orders.searchParam.CreateTime.startDate = null;
			vm.Orders.searchParam.CreateTime.endDate = null;
			vm.Orders.searchParam.CompletionTime.startDate = null;
			vm.Orders.searchParam.CompletionTime.endDate = null;		
		}
		vm.activate();
	}

	vm.removeDateRange = function () {
		vm.SelectDateRange.startDate = null;
		vm.SelectDateRange.endDate = null; 
		vm.SelectedOrderByProperty = null;
		vm.selectDateRange();
		vm.activate()
	}

	vm.SelectOrderBy = function () {
		
			switch(vm.SelectedOrderByProperty) {
				case "CreateTime asc":
					vm.OrderByProperty = "CreateTime";
					vm.OrderByPropertyDirection = "asc";
					break;
				case "CompletionTime asc":
					vm.OrderByProperty = "CompletionTime";
					vm.OrderByPropertyDirection = "asc";
					break;
				case "ModifiedTime asc":
					vm.OrderByProperty = "ModifiedTime";
					vm.OrderByPropertyDirection = "asc";
					break;
				case "CreateTime desc":
					vm.OrderByProperty = "CreateTime";
					vm.OrderByPropertyDirection = "desc";
					break;
				case "CompletionTime desc":
					vm.OrderByProperty = "CompletionTime";
					vm.OrderByPropertyDirection = "desc";
					break;
				case "ModifiedTime desc":
					vm.OrderByProperty = "ModifiedTime";
					vm.OrderByPropertyDirection = "desc";
					break;
			}		
		
		vm.activate();
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
			console.log(vm.EnterpriseUsers)
		});
	}

	vm.AutoRefreshChanged = function () {
		if (vm.autoRefreshState) {
			dashboardFactory.startRefresh();
		} else {
			dashboardFactory.stopRefresh();
		}
	}	

	vm.activate = function () {
		vm.Orders.searchParam.jobState = vm.SelectedState;
		vm.Orders.searchParam.UserName = vm.EnterpriseUser;
		vm.Orders.searchParam.PaymentStatus = vm.PaymentStatus;
		vm.Orders.searchParam.pageSize = vm.JobsPerPage;
		vm.Orders.searchParam.DeliveryArea = vm.DeliveryArea;
		vm.Orders.searchParam.subStringOf.SearchKey = vm.SearchKey;
		vm.Orders.searchParam.orderby.property = vm.OrderByProperty;
		vm.Orders.searchParam.orderby.orderbyCondition = vm.OrderByPropertyDirection;
		vm.Orders.isCompleted = 'IN_PROGRESS';
		vm.Orders.searchParam.AttemptCount = vm.AttemptCount;
		console.log("AttemptCount : " + vm.AttemptCount)
		
		if (vm.Orders.searchParam.jobState === "All") {
			vm.Orders.searchParam.jobState = null;
		}
		if (vm.Orders.searchParam.DeliveryArea === '') {
			vm.Orders.searchParam.DeliveryArea = null;
		}

		if (vm.Orders.searchParam.jobState === '') {
			vm.Orders.searchParam.jobState = null;
		} else if (vm.Orders.searchParam.jobState === "PENDING") {
			vm.Orders.searchParam.jobState = "ENQUEUED";
		}

		if (vm.Orders.searchParam.AttemptCount === "Any") {
			vm.Orders.searchParam.AttemptCount = null;
		}

		
		vm.Orders.loadOrders();
	}

	vm.getEnterpriseUsersList(0);
	vm.activate();


	vm.EnqueuedOrders = dashboardFactory.orders("ENQUEUED");
	vm.EnqueuedOrders.loadOrders();
	vm.InProgressOrders = dashboardFactory.orders("IN_PROGRESS");
	vm.InProgressOrders.loadOrders();
	vm.CompletedOrders = dashboardFactory.orders("COMPLETED");
	vm.CompletedOrders.loadOrders();	
	vm.ReturnedOrders = dashboardFactory.orders("RETURNED_DELIVERY_COMPLETED");
	vm.ReturnedOrders.loadOrders();
	vm.CancelledOrders = dashboardFactory.orders("CANCELLED");
	vm.CancelledOrders.loadOrders();
}