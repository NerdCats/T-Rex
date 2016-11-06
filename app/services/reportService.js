app.service('reportService', ['$http', '$window', '$interval', 'timeAgo', 'restCall', 'queryService', 'dashboardFactory', 'ngAuthSettings', 'reportServiceUrl', reportService]);

function reportService($http, $window, $interval, timeAgo, restCall, queryService, dashboardFactory, ngAuthSettings, reportServiceUrl){

	var populateReport = function (report, url) {
		
		function successCallback(response) {
			if (response.data.data.length === 0) {
				report.status = 'EMPTY'
			} else {
				report.status = 'SUCCESS';
				report.data = response.data.data;
				report.total = Object.keys(report.data).length;
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
			total: 0,
			searchParam : {
				startdate: null, 
				enddate: null,
				type: "ENTERPRISE",
				generateexcel: false,
				userid: null,
				username: null
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
				if (this.searchParam.type === "BIKE_MESSENGER") {
					$window.open("#/report/jobs?" + "startdate=" + this.searchParam.startdate + "&enddate="+ this.searchParam.enddate + 
													"&usertype=BIKE_MESSENGER" + "&userid=" + this.data[user].UserId, '_blank');					
				} else {
					$window.open("#/report/jobs?" + "startdate=" + this.searchParam.startdate + "&enddate="+ this.searchParam.enddate + "&usertype=" + this.searchParam.type + "&username=" + user, '_blank');
				}
			},
			importAsExcel : function () {
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
