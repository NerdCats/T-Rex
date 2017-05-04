(function() {
	'use strict';

	app.controller('tagsController', tagsController);

	function tagsController($scope, $http, $window, ngAuthSettings) {
		var vm = $scope;
		vm.isCreatingTag = false;
		vm.isLoading = false;
		vm.tagLists = {};
		vm.pageSize = 50;
		vm.page = 0;
		vm.envelope = true;
		vm.pagination = [];

		vm.getNewTag = function () {
			return {
				Id: null
			}
		}

		var populatePagination = function () {
			vm.pagination = [];
			for(var i=0; i<vm.tagLists.pagination.TotalPages; i++) {
				vm.pagination.push(i)
			}
		}

		vm.newTag = vm.getNewTag();

		vm.loadByPageNumber = function (pageSize) {
			vm.pageSize = pageSize;
			vm.getTags();
		}

		vm.createTag = function () {
			vm.isCreatingTag = true;

			$http({
				method: 'POST',
				url: ngAuthSettings.apiServiceBaseUri + "api/Tag",
				data: vm.newTag
			}).then(function success(success) {
				vm.getTags();
				vm.isCreatingTag = false;
			}, function error(error) {
				console.log(error);
				vm.isCreatingTag = false;
			});
		}

		vm.getTags = function () {
			vm.isLoading = true;
			$http({
				method: 'GET',
				url: ngAuthSettings.apiServiceBaseUri + "api/DataTag/odata?pageSize="+ vm.pageSize 
																				+"&page="+ vm.page 
																				+"&envelope="+ vm.envelope	
			}).then(function success(success) {			
				vm.isLoading = false;
				vm.tagLists = success.data;
				populatePagination();
				console.log(vm.tagLists);
			}, function error(error) {
				console.log(error);
				$window.location.href = "#/tags";
				vm.isLoading = false;
			});
		}
		vm.getTags();
	}
})();