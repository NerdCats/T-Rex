(function() {
	'use strict';

	app.controller('tagsController', tagsController);

	function tagsController($scope, $http, $window, ngAuthSettings) {
		var vm = $scope;
		vm.isCreatingTag = false;
		vm.isLoading = false;
		vm.tagLists = [];
		vm.pageSize = 50;
		vm.page = 0;
		vm.envelope = true;
		vm.pagination = [];

		vm.getNewTag = function () {
			return {
				Id: null
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
				url: ngAuthSettings.apiServiceBaseUri + "api/DataTag",
				data: vm.newTag
			}).then(function(response) {
				vm.getTags();
				vm.isCreatingTag = false;
			}, function(error) {
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
			}).then(function(response) {			
				vm.isLoading = false;
				vm.tagLists = response.data.data;
				angular.forEach(vm.tagLists, function (tag, index) {
					tag.updateMode = false;
				});
				
				vm.pagination = [];
				for(var i=0; i<response.data.pagination.TotalPages; i++) {
					vm.pagination.push(i)
				}
				console.log(vm.tagLists);
			}, function (error) {
				console.log(error);
				$window.location.href = "#/tags";
				vm.isLoading = false;
			});
		}


		vm.updateTag = function (updatedTag) {
			$http({
				method: 'PUT',
				url: ngAuthSettings.apiServiceBaseUri + "api/DataTag",
				data: { Id: updatedTag }
			}).then(function (response) {
				vm.tagLists[index].updateMode = false;
			}, function (error) {
				
			});
		}

		vm.deleteTag = function (tagId) {
			var itSelf = this;
			itSelf.isLoading = true; 
			$http({
				method: 'DELETE',
				url: ngAuthSettings.apiServiceBaseUri + "api/DataTag/" + tagId,
			}).then(function(response) {
				itSelf.isLoading = false;
				vm.getTags();
				vm.isCreatingTag = false;
			}, function(error) {
				console.log(error);
				vm.isCreatingTag = false;
			});
		}


		vm.getTags();
	}
})();