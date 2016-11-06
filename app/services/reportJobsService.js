app.service('reportJobsService', ['$http', '$window', 'reportServiceUrl', reportJobsService]);

function reportJobsService($http, $window, reportServiceUrl){
	var report = function () {
		return {
			data : [],
			searchParam : {
				startdate : null,
				enddate : null,
				usertype : null,
				username : null,
				userid : null
			},
			isCompleted: "PENDING",
			getReportUrl: function () {
				var reportUrl = reportServiceUrl + "api/details?" + 
								"startdate=" + this.searchParam.startdate + 
								"&enddate=" + this.searchParam.enddate + 
								"&usertype=" + this.searchParam.usertype;
				if (this.searchParam.userid) {
					reportUrl += "&userid=" + this.searchParam.userid; 
				} else if (this.searchParam.username) {
					reportUrl += "&username=" + this.searchParam.username;
				}
				return reportUrl;
			},
			loadReport : function () {
				
				var itSelf = this;
				this.isCompleted = 'IN_PROGRESS';
				var reportUrl = this.getReportUrl();
				$http({
					method: 'GET',
					url: reportUrl
				}).then(function success(response) {
					angular.forEach(response.data.data, function (value, index) {
						itSelf.data.push(value);
					})
					console.log(itSelf.data)
					itSelf.isCompleted = 'SUCCESSFULL';
				}, function error(error) {
					itSelf.isCompleted = 'FAILED'
					console.log("error happened");
				});
			},
			importExcel : function () {
				var reportUrl = this.getReportUrl() + "&generateexcel=true";
				$window.open(reportUrl, '_blank');
			}
		}
	}

	return {
		report : report
	}
}