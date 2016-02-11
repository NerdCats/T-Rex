app.controller('indexController', function ($scope, $http, $interval, $mdDialog, $mdMedia,$window) {

	$scope.templates = [ 
	 	{ name: 'sidebar.html', url: 'template/sidebar.html'},
      	{ name: 'template2.html', url: 'template2.html'} 
    ];
	$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
	//menu options
	$scope.menus = [
		{Title : "Dashboard",  Navigate: function(){$window.location.href = '/index.html'}},
		{Title : "Orders",  Navigate: function(){$window.location.href = '/index.html'}},
		{Title : "Users",  Navigate: function(){$window.location.href = '/index.html'}},
		{Title : "Assets",  Navigate: function(){$window.location.href = '/assets.html'}},
		{Title : "Agents",  Navigate: function(){$window.location.href = '/index.html'}},
		{Title : "Administration",  Navigate: function(){$window.location.href = '/index.html'}}
	];


	var url1 = "http://localhost:23873/api/Job?envelope=true";
	var url2 = "http://127.0.0.1:8080/json/orders.json";
	
	$scope.newOrders = [];
	$scope.processingOrders = [];
	$scope.requestedAgo = function (createTime) {
		var creationTime = new Date(createTime);
		var nowTime = Date.now();
		var diffInMin = (nowTime - creationTime)/1000/60;
		return Math.round(diffInMin);
	}

	$scope.populateTable = function(url, Orders, state){
		$http.get(url).then(function(response){
			$scope.orders = response.data;

			angular.forEach($scope.orders.data, function(value, key){
				var newOrder = {
					Name : value.Name,
					Type : value.Order.Type,
					From : value.Order.From.Address,
					To : value.Order.To.Address,
					User : value.Order.User,
					RequestedAgo : $scope.requestedAgo(value.CreateTime),
					State : value.State,
					Details : function(){
						$window.location.href = '/details.html?id='+ value._id;
					}
				};
				if (value.State == state) Orders.push(newOrder);
			});
			$scope.pages = function(){
				var arr = [];
				for (var i = 1; i <= $scope.orders.pagination.TotalPages ; i++) {
					arr.push(i);
				};
				return arr;
			};
			console.log($scope.pages())
		});
	};

	$scope.newOrders = [];
	$scope.populateTable(url1, $scope.newOrders, "ENQUEUED");
	$scope.populateTable(url1, $scope.processingOrders, "IN_PROGRESS");

	
});