app.directive('reportTable', function(){
	// Runs during compile
	return {
		restrict: 'E',
		scope: {
			report: '=report'
		},
		templateUrl: '../app/directives/ReportTable/reportTable.html',				
	};
});