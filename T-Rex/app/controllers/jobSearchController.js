app.controller('jobSearchController', ['$scope', 'host', 'restCall', 'dashboardFactory', jobSearchController]);

function jobSearchController($scope, host, restCall, dashboardFactory){
	var vm = this;
	vm.startDate = undefined;
	vm.endDate = undefined;
	vm.UserName = undefined;
	vm.jobStates = ["ENQUEUED", "IN_PROGRESS", "COMPLETED"]
	vm.jobState = "";
	vm.SearchResultJobs = {orders: [], pages:[], total: 0};
	vm.selectedItem = undefined;
	vm.searchTextChange = searchTextChange;
	vm.selectedItemChange = selectedItemChange;
	vm.searchText = "";
	vm.querySearch = querySearch;
	vm.searchUrl = "";
	vm.searching = false;

	vm.loadNextPage = function (page) {
		var jobSearchUrlWithPage = searchUrl + "&page=" + page;
		dashboardFactory.populateOrdersTable(vm.SearchResultJobs, jobSearchUrlWithPage);
	}

	vm.Search = function () {
		searchUrl = host + "api/Job/";
		var allreadyAParamIsThere = false;

		if (vm.startDate != undefined || vm.endDate != undefined || vm.UserName != undefined || vm.jobState != "") {
			searchUrl += "odata?$filter=";
		} else {
			searchUrl += "?page=0&envelope=true";
		}
		
		if (vm.startDate != undefined) {
			var startDateParam = "CreateTime gt datetime'"+ vm.startDate.toISOString() +"'";
			if (!allreadyAParamIsThere) {
				console.log("found")
				searchUrl +=  startDateParam;
				allreadyAParamIsThere = true;
			} else {
				searchUrl += " and " + startDateParam;
			}
		}
		if (vm.endDate != undefined) {
			var endDateParam = "CreateTime lt datetime'"+ vm.endDate.toISOString() +"'";
			if (!allreadyAParamIsThere) {
				searchUrl +=  endDateParam;
				allreadyAParamIsThere = true;
			} else {
				searchUrl += " and " + endDateParam;
			}
		}
		if (vm.UserName != undefined) {
			var userNameParam = "User/UserName eq '"+ vm.UserName +"'";
			if (!allreadyAParamIsThere) {
				searchUrl +=  userNameParam;
				allreadyAParamIsThere = true;
			} else {
				searchUrl += " and " + userNameParam;
			}
		}
		if (vm.jobState != "") {
			var jobStateParam = "State eq '"+ vm.jobState +"'";
			console.log(vm.jobState)
			if (!allreadyAParamIsThere) {
				searchUrl +=  jobStateParam;
				allreadyAParamIsThere = true;
			} else {
				searchUrl += " and " + jobStateParam;
			}
		}
		console.log(searchUrl);
		dashboardFactory.populateOrdersTable(vm.SearchResultJobs, searchUrl);
	}

	function searchTextChange(item) {
		console.log("searchText change : ");
		console.log(item);
	}
	function selectedItemChange(item) {
		if (item!=null) {
			vm.UserName = item.UserName;			
		}
		console.log(vm.selectedItem)
		console.log(item);
		console.log(vm.UserName);
	}
	function querySearch(query) {
		loadUserNames(query);
		var results = query ? vm.autocompleteUserNames.filter( createFilterFor(query)) : vm.autocompleteUserNames, deferred;
		return results;
	}
	function loadUserNames(query){
		function successCallback(response) {
			vm.autocompleteUserNames = response.data.data;	
			console.log(vm.autocompleteUserNames)
		}
		function errorCallback(error) {
			console.log(error);
		}

		var getUsersUrl = host + "api/account/odata?" + "$filter=startswith(UserName,'"+ query +"') eq true and Type eq 'USER' or Type eq 'ENTERPRISE'" + "&envelope=" + true + "&page=" + 0 + "&pageSize=" + 20;		
		console.log(getUsersUrl)
		restCall('GET', getUsersUrl, null, successCallback, errorCallback)
		console.log("loadUserNames")
	};
	function createFilterFor(query) {
		// var lowercaseQuery = angular.lowercase(query);

		return function filterFn(state) {			
			return(state.UserName.indexOf(query) === 0)			
		};
	}
}