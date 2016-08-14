app.factory('odata', ['restCall', 'host', odataService])

function odataService(restCall, host){
	
	var odataQueryMaker = function (searchParam) {
		searchUrl = host + "api/Job/";
		var allreadyAParamIsThere = false;
		console.log(searchParam)
		if (searchParam.startDate != null || searchParam.endDate != null || searchParam.UserName != null || searchParam.jobState != null
			|| searchParam.orderby.property != null) {
			searchUrl += "odata?$filter=";
		} else {
			searchUrl += "?page="+ searchParam.page + 
						 "&pageSize="+ searchParam.pageSize +
						 "&envelope="+ searchParam.envelope;
		}

		
		
		if (searchParam.UserName != null && searchParam.UserName != "all") {
			var UserNameParam = "User/UserName eq '"+ searchParam.UserName +"'";
			console.log("how the hell you r coming here ??? Mr. " + searchParam.UserName)
			if (!allreadyAParamIsThere) {
				searchUrl +=  UserNameParam;
				allreadyAParamIsThere = true;
			} else {
				searchUrl += " and " + UserNameParam;
			}
		}

		if (searchParam.startDate != null) {
			var startDateParam = "CreateTime gt datetime'"+ searchParam.startDate +"'";
			if (!allreadyAParamIsThere) {
				searchUrl +=  startDateParam;
				allreadyAParamIsThere = true;
			} else {
				searchUrl += " and " + startDateParam;
			}
		}

		if (searchParam.endDate != null) {
			var endDateParam = "CreateTime lt datetime'"+ searchParam.endDate +"'";
			if (!allreadyAParamIsThere) {
				searchUrl +=  endDateParam;
				allreadyAParamIsThere = true;
			} else {
				searchUrl += " and " + endDateParam;
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

		if (searchParam._t != null) {
			var jobStateParam = "_t eq '"+ searchParam._t +"'";
			console.log(searchParam._t)
			if (!allreadyAParamIsThere) {
				searchUrl +=  jobStateParam;
				allreadyAParamIsThere = true;
			} else {
				searchUrl += " and " + jobStateParam;
			}
		}

		if (searchParam.orderby.property != null) {
			var orderbyParam = "$orderby=" + searchParam.orderby.property;
			if (searchParam.orderby.orderbyCondition != null) {
				orderbyParam += " " + searchParam.orderby.orderbyCondition;
			} else {
				orderbyParam += " desc";
			}

			if (!allreadyAParamIsThere) {
				searchUrl += orderbyParam;
				allreadyAParamIsThere = true;
			} else {
				searchUrl += "&" + orderbyParam;
			}
		}

		searchUrl += "&page="+ searchParam.page + 
					 "&pageSize="+ searchParam.pageSize +
					 "&envelope="+ searchParam.envelope;
		console.log(searchUrl);
		return searchUrl;
	}

	return {
		odataQueryMaker: odataQueryMaker
	}
}