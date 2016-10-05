app.service('reportJobsService', ['$http', '$window', 'reportServiceUrl', reportJobsService]);

function reportJobsService($http, $window, reportServiceUrl){
	var report = function () {
		return {
			data : [],
			searchParam : {
				startdate : null,
				enddate : null,
				usertype : null,
				username : null
			},
			isCompleted: "PENDING",
			loadReport : function () {
				var reportUrl = reportServiceUrl + "api/details?" + 
								"startdate=" + this.searchParam.startdate + 
								"&enddate=" + this.searchParam.enddate + 
								"&usertype" + this.searchParam.usertype + 
								"&username=" + this.searchParam.username;
				var itSelf = this;
				this.isCompleted = 'IN_PROGRESS';
				$http({
					method: 'GET',
					url: reportUrl
				}).then(function success(response) {
					angular.forEach(response.data.data, function (value, index) {
						itSelf.data.push(value);
					})					
					itSelf.isCompleted = 'SUCCESSFULL';
				}, function error(error) {
					itSelf.isCompleted = 'FAILED'
					console.log("error happened");
				});
			},
			importExcel : function () {
				var reportUrl = reportServiceUrl + "api/details?" + 
								"startdate=" + this.searchParam.startdate + 
								"&enddate=" + this.searchParam.enddate + 
								"&usertype" + this.searchParam.usertype + 
								"&username=" + this.searchParam.username + "&generateexcel=true";
				$window.open(reportUrl, '_blank');
			}
		}
	}

	return {
		report : report
	}
}