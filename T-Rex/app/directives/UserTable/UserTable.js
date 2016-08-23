app.directive('orderTable', [function(){
	// Runs during compile
	return {
		restrict: 'E',
		scope: {
			users: '=users'
		},
		templateUrl: '../app/directives/UserTable/userTable.html',		
	};
}]);