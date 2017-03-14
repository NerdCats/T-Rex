(function () {
	
	'use strict';

	app.service('reportService', reportService);

	function reportService($http, $window, $interval, timeAgo, restCall, queryService, dashboardFactory, ngAuthSettings, reportServiceUrl) {

		var populateReport = function (report, url) {
			
			function successCallback(response) {
				if (response.data.data.length === 0) {
					report.status = 'EMPTY'
				} else {
					report.status = 'SUCCESS';
					report.data = response.data.data;				
					report.getTotal();
					console.log(report);
				}
			}

			function errorCallback(error) {
				console.log(error);
				this.status = 'FAILED';
			}

			restCall('GET', url, null, successCallback, errorCallback)
		}

		var getReport = function () {
			return { 
				data: {},			
				searchParam : {
					startdate: null, 
					enddate: null,
					type: "ENTERPRISE",
					generateexcel: false,
					userid: null,
					username: null
				},
				total : {
					totalVendor: 0,
					totalDelivery: 0,
					totalPending: 0,
					totalInProgress: 0,
					totalCompleted: 0,
					totalCancelled: 0,
					totalProductPrice: 0,
					totalDeliveryCharge: 0
				},
				getTotal: function () {
					var itSelf = this;
					itSelf.total.totalVendor = 0;
					itSelf.total.totalDelivery = 0;
					itSelf.total.totalPending = 0;
					itSelf.total.totalInProgress = 0;
					itSelf.total.totalCompleted = 0;
					itSelf.total.totalCancelled = 0;
					itSelf.total.totalProductPrice = 0;
					itSelf.total.totalDeliveryCharge = 0;
					angular.forEach(this.data, function (value, key) {
						itSelf.total.totalVendor += 1;
						itSelf.total.totalDelivery += value.TotalDelivery;
						itSelf.total.totalPending += value.TotalPending;
						itSelf.total.totalInProgress += value.TotalInProgress;
						itSelf.total.totalCompleted += value.TotalCompleted;
						itSelf.total.totalCancelled += value.TotalCancelled;
						itSelf.total.totalProductPrice += value.TotalProductPrice;
						itSelf.total.totalDeliveryCharge += value.TotalDeliveryCharge;
					});
					console.log(this.total)
				},
				getUrl: function () {
					// FIXME: need to be refactored
					if (this.searchParam.type === "BIKE_MESSENGER") {
						return reportServiceUrl + "api/report?startdate="+this.searchParam.startdate+"&enddate="+this.searchParam.enddate+"&usertype="+this.searchParam.type;					
					}
					return reportServiceUrl + "api/report?startdate="+this.searchParam.startdate+"&enddate="+this.searchParam.enddate+"&usertype="+this.searchParam.type;
				},
				getReport: function () {
					var reportUrl = this.getUrl();
					this.status = 'IN_PROGRESS';
					populateReport(this, reportUrl);
				},
				goToReportJobs : function (user) {
					console.log(user)
					console.log(this.data)				
					if (this.searchParam.type === "BIKE_MESSENGER") {
						$window.open("#/report/jobs?" + "startdate=" + this.searchParam.startdate + "&enddate="+ this.searchParam.enddate + 
														"&usertype=BIKE_MESSENGER" + "&userid=" + this.data[user].UserId, '_blank');					
					} else {
						$window.open("#/report/jobs?" + "startdate=" + this.searchParam.startdate + "&enddate="+ this.searchParam.enddate + "&usertype=" + this.searchParam.type + "&username=" + user, '_blank');
					}
				},
				exportExcel : function () {
					var excelReportUrl = reportServiceUrl + "api/report?startdate="+this.searchParam.startdate+"&enddate="+this.searchParam.enddate+"&usertype="+this.searchParam.type + "&generateexcel=true";
					$window.open(excelReportUrl, '_blank');
				},
				status : 'NONE'
			}
		}
		return {
			getReport: getReport
		}
	}
})();
