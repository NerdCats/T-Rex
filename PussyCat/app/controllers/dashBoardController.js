'use strict';

app.controller('dashBoardController', function ($scope, $http, $location, $interval, $mdDialog, $mdMedia,$window,menus, templates) {

	var vm = $scope;
	vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');	
	vm.menus = menus;
	vm.templates = templates;

	var url1 = "http://localhost:23873/api/Job?envelope=true";
	var url2 = "http://127.0.0.1:8080/json/orders.json";
	
	vm.newOrders = [];
	vm.processingOrders = [];
	vm.requestedAgo = function (createTime) {
		var creationTime = new Date(createTime);
		var nowTime = Date.now();
		var diffInMin = (nowTime - creationTime)/1000/60;
		return Math.round(diffInMin);
	}

	vm.populateTable = function(url, Orders, state){
		$http.get(url).then(function(response){
			vm.orders = response.data;
			angular.forEach(vm.orders.data, function(value, key){
				var newOrder = {
					Id : value._id,
					Name : value.Name,
					Type : value.Order.Type,
					From : value.Order.From.Address,
					To : value.Order.To.Address,
					User : value.Order.User,
					RequestedAgo : vm.requestedAgo(value.CreateTime),
					State : value.State,
					Details : function(){
						$location.path('/details/'+ value._id);
						console.log("navigate to details : " + value._id);
					}
				};
				if (value.State == state)
					Orders.push(newOrder);
			});
			vm.pages = function(){
				var arr = [];
				for (var i = 0; i < vm.orders.pagination.TotalPages ; i++) {
					arr.push(i);
				};
				return arr;
			};
			console.log(vm.pages())
		});
	};

	vm.loadNextPage = function(page,state){
		var host = "http://localhost:23873/api/Job?";
		var parameter = "envelope=true&page="+page;
		var url = host + parameter;
		vm.newOrders = [];
		vm.populateTable(url, vm.newOrders, state);
	};

	vm.newOrders = [];
	vm.populateTable(url1, vm.newOrders, "ENQUEUED");
	vm.populateTable(url1, vm.processingOrders, "IN_PROGRESS");
});