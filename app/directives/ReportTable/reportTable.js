(function () {
	
	app.directive('reportTable', function(){	
		return {
			restrict: 'E',
			scope: {
				report: '=report'
			},
			templateUrl: '../app/directives/ReportTable/reportTable.html',				
		};
	});
})();