(function() {
	'use strict';

	app.controller('tagsController', tagsController);

	function tagsController($scope, $http, $window, $ngAuthSettings) {
		var vm = $scope;
		vm.createTag = false;
		vm.isLoading = false;
		vm.tagLists = [];

		vm.getNewTag = function () {
			return {
				Id: null
			}
		}

		vm.getNewTags = vm.getNewTag();

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
				url: ngAuthSettings.apiServiceBaseUri + "api/DataTag"	
			}).then(function success(success) {			
				vm.isLoading = false;
				vm.tagLists = success.data;
			}, function error(error) {
				console.log(error);
				$window.location.href = "#/tags";
				vm.isLoading = false;
			});
		}
		vm.getNewTag();
	}
}();