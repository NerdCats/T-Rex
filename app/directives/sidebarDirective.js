app.directive('sidebarDirective', function() {
    return {
        link : function(scope, element, attr) {
            scope.$watch(attr.sidebarDirective, function(newVal) {
				var id = element[0].id;
				if (id=="sidebar") {
					if(newVal)
					{
						console.log(element);
						element.removeClass('remove-sidebar');
						element.addClass('show-sidebar');

						element.removeClass('flex-0');
						element.addClass('flex-10');
						return;
					}
					element.removeClass('flex-10');
					element.addClass('flex-0');

					element.addClass('remove-sidebar');
					element.removeClass('show-sidebar');

					
				}
				if (id=="ng-view") {
					if (newVal) {
						
						element.removeClass('flex-100');
						element.addClass('flex-90');
						return;
					} else {
							element.removeClass('flex-90');
						element.addClass('flex-100');	
					}
				}
				
            });
        }
    };
});