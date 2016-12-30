// This service is a piece of shit!
// need to refactor

app.factory('queryService', ['restCall', 'ngAuthSettings', queryService])

function queryService(restCall, ngAuthSettings){
	
	var getOdataQuery = function (searchParam) {
		console.log(searchParam);
		var searchUrl = ngAuthSettings.apiServiceBaseUri + "api/"+ searchParam.type;
		var queryUrl = "";
		var allreadyAParamIsThere = false;

		if (searchParam.UserName === "All") {
			searchParam.UserName = null;			
		}
		if (searchParam.DeliveryArea === "All") {
			searchParam.DeliveryArea = null;
		}

		if (searchParam.jobState === null && searchParam.CreateTime.startDate === null && searchParam.CreateTime.endDate === null && searchParam.subStringOf.SearchKey === null
			&& searchParam.UserName === null && searchParam.PaymentStatus === null && searchParam.subStringOf.RecipientsPhoneNumber === null && searchParam.orderby.property === null) {
			queryUrl = "/" + "odata?";			
		}
		
		else if (searchParam.CreateTime.startDate != null || searchParam.CreateTime.endDate != null || searchParam.subStringOf.SearchKey !== null ||
			searchParam.UserName != null || searchParam.jobState != null || 
			searchParam.userType != null || searchParam.PaymentStatus != null ||
			searchParam.subStringOf.RecipientsPhoneNumber != null && searchParam.orderby.property !== null) {
			queryUrl = "/" + "odata?$filter=";			
		}

		else {
			queryUrl = "?";
		}		
		
		if (searchParam.UserName != null) {
			var UserNameParam = "User/UserName eq '"+ searchParam.UserName +"'";
			if (!allreadyAParamIsThere) {
				queryUrl +=  UserNameParam;
				allreadyAParamIsThere = true;
			} else {
				queryUrl += " and " + UserNameParam;
			}
		}

		
		if (searchParam.subStringOf.SearchKey != null) {
			var RecipientsPhoneNumberParam = "(substringof('"+ searchParam.subStringOf.SearchKey + "',Order/To/Address) "+
												"or substringof('"+ searchParam.subStringOf.SearchKey +"',Order/ReferenceInvoiceId) "+
												"or substringof('"+ searchParam.subStringOf.SearchKey +"',HRID))";
			if (!allreadyAParamIsThere) {
				queryUrl +=  RecipientsPhoneNumberParam;
				allreadyAParamIsThere = true;
			} else {
				queryUrl += " and " + RecipientsPhoneNumberParam;
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

		if (searchParam.PaymentStatus != null && searchParam.PaymentStatus != '') {
			var PaymentStatusParam = "PaymentStatus eq '"+ searchParam.PaymentStatus +"'";
			if (!allreadyAParamIsThere) {
				queryUrl +=  PaymentStatusParam;
				allreadyAParamIsThere = true;
			} else {
				queryUrl += " and " + PaymentStatusParam;
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

		if (searchParam.PickupArea != null) {
			var PickupAreaParam = "Order/From/Locality eq '"+ searchParam.PickupArea +"'";
			console.log(searchParam.PickupArea)
			if (!allreadyAParamIsThere) {
				queryUrl +=  PickupAreaParam;
				allreadyAParamIsThere = true;
			} else {
				queryUrl += " and (" + PickupAreaParam + " or Order/From/Locality eq null)";
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