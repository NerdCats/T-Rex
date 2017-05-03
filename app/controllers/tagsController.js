(function() {
	'use strict';

	app.controller('tagsController', tagsController);

	function tagsController($scope, $http, $window, $ngAuthSettings) {
		var vm = $scope;
		vm.createTag = false;
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
			for(var i=0; i<vm.productsCategories.pagination.TotalPages; i++) {
				vm.pagination.push(i)
			}
		}

		vm.getNewTags = vm.getNewTag();

			vm.loadByPageNumber = function (pageSize) {
			vm.pageSize = pageSize;
			vm.getTags();
		}

			vm.createTags = function () {
			vm.createTag = true;

			$http({
				method: 'POST',
				url: ngAuthSettings.apiServiceBaseUri + "api/Tag",
				data: vm.getNewTags
			}).then(function success(success) {
				vm.getTags();
				vm.createTag = false;
			}, function error(error) {
				console.log(error);
				vm.createTag = false;
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
			}, function error(error) {
				console.log(error);
				$window.location.href = "#/tags";
				vm.isLoading = false;
			});
		}
		vm.getTags();
	}
}();