'use strict';
app.controller('jobSearchController', ['$scope', 'ngAuthSettings', 'restCall', 'dashboardFactory', 'jobSearch', jobSearchController]);

function jobSearchController($scope, ngAuthSettings, restCall, dashboardFactory, jobSearch){
	var vm = this;
	vm.jobStates = ["ENQUEUED", "IN_PROGRESS", "COMPLETED"]
	vm.SearchResultJobs = {orders: [], pages:[], total: 0};
	vm.selectedItem = null;
	vm.searchTextChange = searchTextChange;
	vm.selectedItemChange = selectedItemChange;
	vm.searchText = "";
	vm.querySearch = querySearch;
	vm.searchUrl = "";
	vm.searching = false;

	vm.searchParam = {
		startDate : null,
		endDate: null,
		UserName: null,
		jobState: null
	}

	vm.loadNextPage = function (page) {
		var jobSearchUrlWithPage = vm.searchUrl + "&page=" + page;
		dashboardFactory.populateOrdersTable(vm.SearchResultJobs, jobSearchUrlWithPage);
	}

	vm.Search = function () {
		console.log(vm.searchParam)
		vm.searchUrl = jobSearch.Search(vm.searchParam);

		dashboardFactory.populateOrdersTable(vm.SearchResultJobs, vm.searchUrl);
	}

	function searchTextChange(item) {
		console.log("searchText change : ");
		console.log(item);
	}
	function selectedItemChange(item) {
		if (item!=null) {
			vm.searchParam.UserName = item.UserName;			
		}
		console.log(vm.selectedItem)
		console.log(item);
		console.log(vm.searchParam.UserName);
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

		var getUsersUrl = ngAuthSettings.apiServiceBaseUri + "api/account/odata?" + "$filter=startswith(UserName,'"+ query +"') eq true and Type eq 'USER' or Type eq 'ENTERPRISE'" + "&envelope=" + true + "&page=" + 0 + "&pageSize=" + 20;		
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