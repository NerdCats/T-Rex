app.directive('orderTable', function () {
	return {
		restrict: 'E',
		scope: {
			orders: '=orders',			
		},
		link: function(scope, elem, attr) {
			console.log(scope)
			console.log(elem)
			console.log(attr)
        },
		templateUrl: 'app/directives/OrderTable/orderTable.html'
	};
});