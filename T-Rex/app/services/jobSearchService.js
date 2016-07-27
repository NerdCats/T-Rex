app.factory('jobSearch', ['restCall', 'host', jobSearchService])

function jobSearchService(restCall, host){
	
	var Search = function (searchParam) {
		searchUrl = host + "api/Job/";
		var allreadyAParamIsThere = false;

		if (searchParam.startDate != null || searchParam.endDate != null || searchParam.UserName != null || searchParam.jobState != "") {
			searchUrl += "odata?$filter=";
		} else {
			searchUrl += "?page=0&envelope=true";
		}
		
		if (searchParam.startDate != null) {
			var startDateParam = "CreateTime gt datetime'"+ searchParam.startDate.toISOString() +"'";
			if (!allreadyAParamIsThere) {
				console.log("found")
				searchUrl +=  startDateParam;
				allreadyAParamIsThere = true;
			} else {
				searchUrl += " and " + startDateParam;
			}
		}
		if (searchParam.endDate != null) {
			var endDateParam = "CreateTime lt datetime'"+ searchParam.endDate.toISOString() +"'";
			if (!allreadyAParamIsThere) {
				searchUrl +=  endDateParam;
				allreadyAParamIsThere = true;
			} else {
				searchUrl += " and " + endDateParam;
			}
		}
		if (searchParam.UserName != null) {
			var userNameParam = "User/UserName eq '"+ searchParam.UserName +"'";
			if (!allreadyAParamIsThere) {
				searchUrl +=  userNameParam;
				allreadyAParamIsThere = true;
			} else {
				searchUrl += " and " + userNameParam;
			}
		}
		if (searchParam.jobState != null) {
			var jobStateParam = "State eq '"+ searchParam.jobState +"'";
			console.log(searchParam.jobState)
			if (!allreadyAParamIsThere) {
				searchUrl +=  jobStateParam;
				allreadyAParamIsThere = true;
			} else {
				searchUrl += " and " + jobStateParam;
			}
		}
		console.log(searchUrl);
		return searchUrl;
	}

	return {
		Search: Search
	}
}