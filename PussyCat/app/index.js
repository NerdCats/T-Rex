'use strict';

app.controller('indexController', function ($scope, $http, $location, $interval, $mdDialog, $mdMedia,$window,menus, templates) {

	$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
	//menu options
	$scope.menus = menus;
	$scope.templates = templates;

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
					Id : value._id,
					Name : value.Name,
					Type : value.Order.Type,
					From : value.Order.From.Address,
					To : value.Order.To.Address,
					User : value.Order.User,
					RequestedAgo : $scope.requestedAgo(value.CreateTime),
					State : value.State,
					Details : function(){
						//$window.location.href = '/details.html?id='+ value._id;
						$location.path('/details/'+ value._id);
						console.log("navigate to details : " + value._id);

					}
				};
				if (value.State == state) Orders.push(newOrder);
			});
			$scope.pages = function(){
				var arr = [];
				for (var i = 0; i < $scope.orders.pagination.TotalPages ; i++) {
					arr.push(i);
				};
				return arr;
			};
			console.log($scope.pages())
		});
	};

	$scope.loadNextPage = function(page,state){
		var host = "http://localhost:23873/api/Job?";
		var parameter = "envelope=true&page="+page;
		var url = host + parameter;
		$scope.newOrders = [];
		$scope.populateTable(url, $scope.newOrders, state);
	};

	$scope.newOrders = [];
	$scope.populateTable(url1, $scope.newOrders, "ENQUEUED");
	$scope.populateTable(url1, $scope.processingOrders, "IN_PROGRESS");
});