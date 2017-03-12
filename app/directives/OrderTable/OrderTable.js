(function () {
	
	app.directive('orderTable', function () {
		return {
			restrict: 'E',
			scope: {
				orders: '=orders',
			},
			templateUrl: 'app/directives/OrderTable/orderTable.html'
		};
	});
})();