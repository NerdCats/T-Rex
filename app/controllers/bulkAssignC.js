(function () {

	'use strict';

	app.controller('bulkAssignC', bulkAssignC);

	function bulkAssignC($scope, $http, ngAuthSettings, Areas, dashboardFactory, excelWriteService){
		var vm = $scope;
		vm.listOfHRID = [];
		vm.Assets = [];
		vm.DeliveryAreas = Areas;
		
		vm.SelectedState = "ENQUEUED";
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
		vm.assetIdToLoadInprogressJobs = null;

		vm.selectedAssetId = null;
		vm.selectedTaskIndexForAssign = null;
		vm.selectedTaskIndexForComplete = null;

		vm.Orders = dashboardFactory.orders("ENQUEUED");
		vm.Orders.searchParam.jobState === 'IN_PROGRESS';
		vm.Orders.assign.showPickupAssign = true;
		vm.Orders.assign.showdeliveryAssign = true;
		vm.Orders.assign.showsecuredeliveryAssign = true;
		vm.Orders.showPaymentUpdateOption = true;

		vm.assetChanged = function () {			
			vm.Orders.assign.assetRef = vm.selectedAssetId;
			angular.forEach(vm.Assets, function (asset, index) {
				if (asset.Id === vm.selectedAssetId) {
					vm.Orders.selectedAssetName = asset.UserName;				
				}
			})
		}

		vm.downloadExcelWorkOrder = function (tableId) {
			var filename = "Workorder.xlsx";
			if(vm.selectedAsset){
				filename = "workorder - "+ vm.selectedAsset.UserName + " - " + new Date().toDateString() + ".xlsx";
			}
			var excelObjectArray = [];
			var excelHeading = [];
			excelHeading.push("HRID");
			excelHeading.push("User");
			excelHeading.push("ReferenceInvoiceId");
			excelHeading.push("Recipient Name");
			excelHeading.push("PhoneNumber");
			excelHeading.push("Delivery Address");
			excelHeading.push("TotalToPrice");
			excelHeading.push("NoteToDeliveryMan");
			excelObjectArray.push(excelHeading);

			angular.forEach(vm.Orders.data, function (value, key) {
				var job = value.data;
				var excelRow = [];
				excelRow.push(job.HRID);
				excelRow.push(job.User.UserName);
				excelRow.push(job.Order.ReferenceInvoiceId);
				if (job.Order.BuyerInfo) {
					excelRow.push(job.Order.BuyerInfo.Name);
				} else {
					excelRow.push("");
				}
				if (job.Order.BuyerInfo) {
					excelRow.push(job.Order.BuyerInfo.PhoneNumber);
				} else {
					excelRow.push("");
				}
				if (job.Order.BuyerInfo) {
					excelRow.push(job.Order.BuyerInfo.Address.Address);
				} else {
					excelRow.push(job.Order.To.Address);
				}
				excelRow.push(job.Order.OrderCart.TotalToPay);
				excelRow.push(job.Order.NoteToDeliveryMan);

				excelObjectArray.push(excelRow);
			});

			var rowCount = vm.Orders.data.length + 1;
			var columnCount = 6;
			var options = [
				    {
				      "s": { "r": rowCount, "c": 0 },
				      "e": { "r": rowCount, "c": 6 }
				    }
				 ]
			var data = [excelObjectArray, options];
			excelWriteService.export_excel(data, 'xlsx', filename);
		}

		vm.assignAssetToTask = function (taskTypeOrName) {
			angular.forEach(vm.Orders.selectedJobsIndexes, function (HRID, jobIndex) {						
				var task = vm.Orders.loadSingleTask(taskTypeOrName, jobIndex);
				vm.Orders.assignAssetToTask(jobIndex, task, "AssetAssign");
				switch(taskTypeOrName){
					case 'PackagePickUp':
						vm.Orders.data[jobIndex].isAssigningPickUpAsset= true;
						break;
					case 'Delivery':
						vm.Orders.data[jobIndex].isAssigningDeliveryAsset = true;
						break;
					case 'SecureDelivery':
						vm.Orders.data[jobIndex].isAssigningSecureCashDeliveryAsset = true;
						break;
					default:
						break;
				}
			});
		}

		vm.completeTask = function (taskTypeOrName) {
			angular.forEach(vm.Orders.selectedJobsIndexes, function (HRID, jobIndex) {
				var task = vm.Orders.loadSingleTask(taskTypeOrName, jobIndex);
				vm.Orders.assignAssetToTask(jobIndex, task, "TaskComplete");

				switch(taskTypeOrName){
					case 'PackagePickUp':
						vm.Orders.data[jobIndex].isCompletingPickUpAsset = true;
						break;
					case 'Delivery':
						vm.Orders.data[jobIndex].isCompletingDeliveryAsset = true;
						break;
					case 'SecureDelivery':
						vm.Orders.data[jobIndex].isCompletingSecureCashDeliveryAsset = true;
						break;
				}
			})
		}

		vm.getEnterpriseUsersList = function (page) {
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

		vm.onSelectEnterprise = function ($item, $model, $label, $event){		
			vm.EnterpriseUser = $item.UserName;		
			console.log(vm.EnterpriseUser);
		}

		vm.onSelectAssetToLoadInprogressJobs = function ($item, $model, $label, $event) {
			vm.assetIdToLoadInprogressJobs = $item.Id;
			console.log(vm.assetIdToLoadInprogressJobs);
		}

		vm.getAssetsList = function (page) {		
			var getUsersUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/odata?$filter=Type eq 'BIKE_MESSENGER'&$orderby=UserName&page="+ page +"&pageSize=50";
			dashboardFactory.getUserNameList(getUsersUrl).then(function (response) {
				if (page === 0) {
					vm.Assets = [];				
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

		vm.onSelectAsset = function ($item, $model, $label, $event){		
			vm.selectedAssetId = $item.Id;		
			console.log($item);
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

		vm.loadDeliveryInProgresshJobsByAsset = function () {
			if (vm.assetNameIdToLoadInprogressJobs) {				
				vm.SelectedState = null;
				vm.EnterpriseUser = null;
				vm.PaymentStatus = null;
				vm.DeliveryArea = null;
				vm.SearchKey = null;
				vm.OrderByProperty = null;
				vm.OrderByPropertyDirection = null;
				vm.AttemptCount = null;
			}
			if (!vm.assetNameIdToLoadInprogressJobs) {
				vm.assetIdToLoadInprogressJobs = null;
			}
			vm.Orders.searchParam.userId = vm.assetIdToLoadInprogressJobs;
		}

		vm.activate = function () {
			vm.loadDeliveryInProgresshJobsByAsset();
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
		vm.getAssetsList(0);
		vm.getEnterpriseUsersList(0);


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
		});
	}
})();