(function () {
	
	'use strict';

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

			if(searchParam.Id == "All") {
				searchParam.Id = null;
			}

			if (
				!searchParam.jobState && 
				!searchParam.CreateTime.startDate && 
				!searchParam.CreateTime.endDate && 
				!searchParam.ModifiedTime.startDate && 
				!searchParam.ModifiedTime.endDate && 
				!searchParam.CompletionTime.startDate && 
				!searchParam.CompletionTime.endDate && 
				!searchParam.subStringOf.SearchKey&& 
				!searchParam.UserName && 
				!searchParam.Id &&
				!searchParam.userType &&
				!searchParam.DeliveryArea &&
				!searchParam.PaymentStatus &&
				!searchParam.AttemptCount &&
				!searchParam.subStringOf.RecipientsPhoneNumber
				) {
				queryUrl = "/" + "odata?";			
			}
			
			else if (
					searchParam.jobState || 
					searchParam.CreateTime.startDate || 
					searchParam.CreateTime.endDate ||
					searchParam.ModifiedTime.startDate ||
					searchParam.ModifiedTime.endDate ||
					searchParam.CompletionTime.startDate ||
					searchParam.CompletionTime.endDate  ||
					searchParam.subStringOf.SearchKey ||
					searchParam.UserName || 
					searchParam.Id ||
					searchParam.userType ||
					searchParam.DeliveryArea ||
					searchParam.PaymentStatus ||
					searchParam.AttemptCount ||
					searchParam.subStringOf.RecipientsPhoneNumber
					) {
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

			if (searchParam.Id != null) {
				var TagIdParam = "Tags/Id eq '"+ searchParam.Id +"'";
				if (!allreadyAParamIsThere) {
					queryUrl +=  TagIdParam;
					allreadyAParamIsThere = true;
				} else {
					queryUrl += " and " + TagIdParam;
				}
			}

			
			if (searchParam.subStringOf.SearchKey != null) {
				var RecipientsPhoneNumberParam = "(substringof('"+ searchParam.subStringOf.SearchKey + "',Order/To/Address) "+
													"or substringof('"+ searchParam.subStringOf.SearchKey +"',Order/From/Address) "+
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

			if (searchParam.ModifiedTime.startDate != null) {
				var startDateParam = "ModifiedTime gt datetime'"+ searchParam.ModifiedTime.startDate +"'";
				if (!allreadyAParamIsThere) {
					queryUrl +=  startDateParam;
					allreadyAParamIsThere = true;
				} else {
					queryUrl += " and " + startDateParam;
				}
			}

			if (searchParam.ModifiedTime.endDate != null) {
				var endDateParam = "ModifiedTime lt datetime'"+ searchParam.ModifiedTime.endDate +"'";
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
				var jobStateParam = null;

				switch(searchParam.jobState){
					case 'ENQUEUED':
					case 'IN_PROGRESS':
					case 'COMPLETED':
					case 'CANCELLED':
						jobStateParam = "(State eq '"+ searchParam.jobState +"')";
						break;
					case 'IN PROGRESS':
						jobStateParam = "(State eq 'IN_PROGRESS')";
						break;
					case 'PENDING':
						jobStateParam = "(State eq 'ENQUEUED')";
						break;
					case 'PENDING AND IN PROGRESS':
						jobStateParam = "(State eq 'ENQUEUED' or State eq 'IN_PROGRESS')";
						break;
					case 'PICKUP IN PROGRESS':
						jobStateParam = "(Tasks/any(task: task/State eq 'IN_PROGRESS' and task/Type eq 'PackagePickUp'))";
						break;
					case 'ALL DELIVERY IN PROGRESS':
						jobStateParam = "(Tasks/any(task: task/State eq 'IN_PROGRESS' and task/Type eq 'Delivery'))";
						break;
					case 'DELIVERY IN PROGRESS':
						jobStateParam = "(Tasks/any(task: task/State eq 'IN_PROGRESS' and task/Variant eq 'default' and task/Type eq 'Delivery'))";
						break;
					case 'CASH DELIVERY IN PROGRESS':
						jobStateParam = "(Tasks/any(task: task/State eq 'IN_PROGRESS' and task/Name eq 'SecureDelivery'))";
						break;
					case 'PACKAGE RETURN IN PROGRESS':
						jobStateParam = "(Tasks/any(task: task/State eq 'IN_PROGRESS' and task/Variant eq 'return' and task/Type eq 'Delivery'))";
						break;
					case 'RETRY DELIVERY IN PROGRESS':
						jobStateParam = "(Tasks/any(task: task/State eq 'IN_PROGRESS' and task/Variant eq 'retry' and task/Type eq 'Delivery'))";
						break;

						
					case 'PICKUP COMPLETED':
						jobStateParam = "(Tasks/any(task: task/State eq 'COMPLETED' and task/Type eq 'PackagePickUp'))";
						break;
					case 'ALL DELIVERY COMPLETED':
						jobStateParam = "(Tasks/any(task: task/State eq 'COMPLETED' and task/Type eq 'Delivery'))";
						break;
					case 'DELIVERY COMPLETED':
						jobStateParam = "(Tasks/any(task: task/State eq 'COMPLETED' and task/Variant eq 'default' and task/Type eq 'Delivery'))";
						break;
					case 'CASH DELIVERY COMPLETED':
						jobStateParam = "(Tasks/any(task: task/State eq 'COMPLETED' and task/Name eq 'SecureDelivery'))";
						break;
					case 'RETRY DELIVERY COMPLETED':
						jobStateParam = "(Tasks/any(task: task/State eq 'COMPLETED' and task/Variant eq 'retry' and task/Type eq 'Delivery'))";
						break;
					case 'PACKAGE RETURN COMPLETED':
						jobStateParam = "(Tasks/any(task: task/State eq 'COMPLETED' and task/Variant eq 'return' and task/Type eq 'Delivery'))";
						break;
				}


				console.log(searchParam.jobState)
				if (!allreadyAParamIsThere) {
					queryUrl +=  jobStateParam;
					allreadyAParamIsThere = true;
				} else {
					queryUrl += " and " + jobStateParam;
				}
			}

			if (searchParam.AttemptCount != null && searchParam.AttemptCount  != 'all') {
				var AttemptCountParam = "AttemptCount eq " + searchParam.AttemptCount;
				console.log(searchParam.AttemptCount)
				if (!allreadyAParamIsThere) {
					queryUrl +=  AttemptCountParam;
					allreadyAParamIsThere = true;
				} else {
					queryUrl += " and " + AttemptCountParam;
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
			if (searchParam.countOnly) {
				queryUrl += "&countOnly=" + searchParam.countOnly;
			}

			console.log(queryUrl);
			return searchUrl + queryUrl;
		}

		return {
			getOdataQuery: getOdataQuery
		}
	}
})();