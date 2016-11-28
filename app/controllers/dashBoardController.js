'use strict';

app.controller('dashBoardController', ['$scope', '$interval', '$window', 'Areas', 'ngAuthSettings', 'timeAgo', 'restCall', 'dashboardFactory', dashBoardController]);

function dashBoardController($scope, $interval, $window, Areas, ngAuthSettings, timeAgo, restCall, dashboardFactory)  {

	var vm = $scope;	
	vm.autoRefreshState = true;
	vm.jobPerPage = 50;
	vm.startDate = undefined;
	vm.endDate = undefined;
	vm.EnterpriseUser = null;
	vm.DeliveryArea = null;
	vm.PaymentStatus = null;
	vm.PhoneNumber = null;

	vm.DeliveryAreas = Areas;	
	vm.EnterpriseUsers = [];	

	vm.allOrders = dashboardFactory.orders(null);
	vm.newOrders = dashboardFactory.orders("ENQUEUED");
	vm.processingOrders = dashboardFactory.orders("IN_PROGRESS");	
	vm.completedOrders = dashboardFactory.orders("COMPLETED");
	vm.cancelledOrders = dashboardFactory.orders("CANCELLED");	
	

	vm.getEnterpriseUsersList = function () {
		dashboardFactory.getUserNameList("ENTERPRISE", vm.EnterpriseUsers);
	}
	

	vm.clearDate = function () {
		vm.startDate = undefined;
		vm.endDate = undefined;

		vm.activate();
	}
	vm.setDate = function () {
		var startDateISO = undefined;
		var endDateISO = undefined;
		
		if (vm.startDate&&vm.endDate) {
			startDateISO = dashboardFactory.getIsoDate(vm.startDate,0,0,0);
			// new Date(vm.startDate.getFullYear(), vm.startDate.getMonth(), vm.startDate.getDate(), 0, 0, 0).toISOString();
			endDateISO = dashboardFactory.getIsoDate(vm.endDate,23,59,59);
			// new Date(vm.endDate.getFullYear(), vm.endDate.getMonth(), vm.endDate.getDate(), 23, 59, 59).toISOString();			
		}

		vm.allOrders.searchParam.CreateTime.startDate = startDateISO;
		vm.allOrders.searchParam.CreateTime.endDate = endDateISO;

		vm.newOrders.searchParam.CreateTime.startDate = startDateISO;
		vm.newOrders.searchParam.CreateTime.endDate = endDateISO;

		// vm.processingOrders.searchParam.startDate = startDateISO;
		// vm.processingOrders.searchParam.endDate = endDateISO;

		vm.completedOrders.searchParam.CompletionTime.startDate = startDateISO;
		vm.completedOrders.searchParam.CompletionTime.endDate = endDateISO;

		// FIXME: remember, in future, if there are any order STATE as returned, we need
		// to open up another list
		vm.cancelledOrders.searchParam.CreateTime.startDate = startDateISO;
		vm.cancelledOrders.searchParam.CreateTime.endDate = endDateISO;		
	}

	

	vm.AutoRefreshChanged = function () {
		if (vm.autoRefreshState) {
			dashboardFactory.startRefresh();
		} else {
			dashboardFactory.stopRefresh();
		}
	}

	vm.refresh = function (order) {
		order.isCompleted = "IN_PROGRESS";
		order.loadOrders();
	}

	vm.saerchByPhoneNumber = function () {
		vm.allOrders.resetSearchParams();
		vm.newOrders.resetSearchParams();
		vm.processingOrders.resetSearchParams();
		vm.completedOrders.resetSearchParams();
		vm.cancelledOrders.resetSearchParams();
	}

	vm.activate = function () {

		vm.getEnterpriseUsersList();

		
		vm.allOrders.searchParam.UserName = vm.EnterpriseUser;
		vm.newOrders.searchParam.UserName = vm.EnterpriseUser;
		vm.processingOrders.searchParam.UserName = vm.EnterpriseUser;
		vm.completedOrders.searchParam.UserName = vm.EnterpriseUser;
		vm.cancelledOrders.searchParam.UserName = vm.EnterpriseUser;

		vm.allOrders.searchParam.PaymentStatus = vm.PaymentStatus;
		vm.newOrders.searchParam.PaymentStatus = vm.PaymentStatus;
		vm.processingOrders.searchParam.PaymentStatus = vm.PaymentStatus;
		vm.completedOrders.searchParam.PaymentStatus = vm.PaymentStatus;
		vm.cancelledOrders.searchParam.PaymentStatus = vm.PaymentStatus;
		
		vm.allOrders.searchParam.pageSize = vm.jobPerPage;
		vm.newOrders.searchParam.pageSize = vm.jobPerPage;
		vm.processingOrders.searchParam.pageSize = vm.jobPerPage;
		vm.completedOrders.searchParam.pageSize = vm.jobPerPage;
		vm.cancelledOrders.searchParam.pageSize = vm.jobPerPage;

		vm.allOrders.searchParam.DeliveryArea = vm.DeliveryArea;
		vm.newOrders.searchParam.DeliveryArea = vm.DeliveryArea;
		vm.processingOrders.searchParam.DeliveryArea = vm.DeliveryArea;
		vm.completedOrders.searchParam.DeliveryArea = vm.DeliveryArea;
		vm.cancelledOrders.searchParam.DeliveryArea = vm.DeliveryArea;

		vm.allOrders.searchParam.subStringOf.RecipientsPhoneNumber = vm.PhoneNumber;
		vm.newOrders.searchParam.subStringOf.RecipientsPhoneNumber = vm.PhoneNumber;
		vm.processingOrders.searchParam.subStringOf.RecipientsPhoneNumber = vm.PhoneNumber;
		vm.completedOrders.searchParam.subStringOf.RecipientsPhoneNumber = vm.PhoneNumber;
		vm.cancelledOrders.searchParam.subStringOf.RecipientsPhoneNumber = vm.PhoneNumber;


		vm.allOrders.searchParam.orderby.property = "ModifiedTime";
		vm.newOrders.searchParam.orderby.property = "CreateTime";
		vm.processingOrders.searchParam.orderby.property = "ModifiedTime";
		vm.completedOrders.searchParam.orderby.property = "CompletionTime";
		vm.cancelledOrders.searchParam.orderby.property = "ModifiedTime";
		

		vm.allOrders.isCompleted = 'IN_PROGRESS';
		vm.newOrders.isCompleted = 'IN_PROGRESS';
		vm.processingOrders.isCompleted = 'IN_PROGRESS';
		vm.completedOrders.isCompleted = 'IN_PROGRESS';
		vm.cancelledOrders.isCompleted = 'IN_PROGRESS';

		vm.setDate();

		vm.allOrders.loadOrders();
		vm.newOrders.loadOrders();
		vm.processingOrders.loadOrders();
		vm.completedOrders.loadOrders();
		vm.cancelledOrders.loadOrders();
		
		dashboardFactory.startRefresh(vm.newOrders);
	}
	vm.activate();
}