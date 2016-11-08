// This service is a piece of shit!
// need to refactor

app.factory('queryService', ['restCall', 'ngAuthSettings', queryService])

function queryService(restCall, ngAuthSettings){
	
	var getOdataQuery = function (searchParam) {
		console.log(searchParam);
		var searchUrl = ngAuthSettings.apiServiceBaseUri + "api/"+ searchParam.type;
		var queryUrl = "";
		var allreadyAParamIsThere = false;		

		if (searchParam.jobState === null && searchParam.startDate == null && searchParam.endDate == null && searchParam.UserName == null) {
			queryUrl = "/" + "odata?"
		}
		
		else if (searchParam.startDate != null || searchParam.endDate != null || searchParam.UserName != null || searchParam.jobState != null) {
			queryUrl = "/" + "odata?$filter=";
		}

		else {
			queryUrl = "?page="+ searchParam.page + 
						 "&pageSize="+ searchParam.pageSize +
						 "&envelope="+ searchParam.envelope;
		}		
		
		if (searchParam.UserName != null) {
			var UserNameParam = "User/UserName eq '"+ searchParam.UserName +"'";
			console.log("how the hell you r coming here ??? Mr. " + searchParam.UserName)
			if (!allreadyAParamIsThere) {
				queryUrl +=  UserNameParam;
				allreadyAParamIsThere = true;
			} else {
				queryUrl += " and " + UserNameParam;
			}
		}

		if (searchParam.CreateTime.startDate != null) {
			var startDateParam = "CreateTime gt datetime'"+ searchParam.CreateTime.startDate +"'";
			if (!allreadyAParamIsThere) {
				queryUrl +=  startDateParam;
				allreadyAParamIsThere = true;
			} else {
				queryUrl += " and " + startDateParam;
			}
		}

		if (searchParam.CreateTime.endDate != null) {
			var endDateParam = "CreateTime lt datetime'"+ searchParam.CreateTime.endDate +"'";
			if (!allreadyAParamIsThere) {
				queryUrl +=  endDateParam;
				allreadyAParamIsThere = true;
			} else {
				queryUrl += " and " + endDateParam;
			}
		}

		if (searchParam.CompletionTime.startDate != null) {
			var startDateParam = "CompletionTime gt datetime'"+ searchParam.CompletionTime.startDate +"'";
			if (!allreadyAParamIsThere) {
				queryUrl +=  startDateParam;
				allreadyAParamIsThere = true;
			} else {
				queryUrl += " and " + startDateParam;
			}
		}

		if (searchParam.CompletionTime.endDate != null) {
			var endDateParam = "CompletionTime lt datetime'"+ searchParam.CompletionTime.endDate +"'";
			if (!allreadyAParamIsThere) {
				queryUrl +=  endDateParam;
				allreadyAParamIsThere = true;
			} else {
				queryUrl += " and " + endDateParam;
			}
		}

		if (searchParam.jobState != null && searchParam.jobState  != 'all') {
			var jobStateParam = "State eq '"+ searchParam.jobState +"'";
			console.log(searchParam.jobState)
			if (!allreadyAParamIsThere) {
				queryUrl +=  jobStateParam;
				allreadyAParamIsThere = true;
			} else {
				queryUrl += " and " + jobStateParam;
			}
		}

		if (searchParam.userType != null) {
			var userTypeParam = "Type eq '"+ searchParam.userType +"'";
			console.log(searchParam.userType)
			if (!allreadyAParamIsThere) {
				queryUrl +=  userTypeParam;
				allreadyAParamIsThere = true;
			} else {
				queryUrl += " and " + userTypeParam;
			}
		}

		if (searchParam.DeliveryArea != null) {
			var deliveryAreaParam = "Order/To/Locality eq '"+ searchParam.DeliveryArea +"'";
			console.log(searchParam.DeliveryArea)
			if (!allreadyAParamIsThere) {
				queryUrl +=  deliveryAreaParam;
				allreadyAParamIsThere = true;
			} else {
				queryUrl += " and (" + deliveryAreaParam + " or Order/To/Locality eq null)";
			}
		}

		if (searchParam._t != null) {
			var jobStateParam = "_t eq '"+ searchParam._t +"'";
			console.log(searchParam._t)
			if (!allreadyAParamIsThere) {
				queryUrl +=  jobStateParam;
				allreadyAParamIsThere = true;
			} else {
				queryUrl += " and " + jobStateParam;
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
				queryUrl += orderbyParam;
				allreadyAParamIsThere = true;
			} else {
				queryUrl += "&" + orderbyParam;
			}
		}

		queryUrl += "&page="+ searchParam.page + 
					 "&pageSize="+ searchParam.pageSize +
					 "&envelope="+ searchParam.envelope;

		console.log(queryUrl);
		return searchUrl + queryUrl;
	}

	return {
		getOdataQuery: getOdataQuery
	}
}