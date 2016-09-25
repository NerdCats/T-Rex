app.controller('bulkOrderC', ['$scope', bulkOrderC]);

function bulkOrderC ($scope) {
	
	var vm = $scope;

	vm.CSV;

	vm.uploadFile = function () {		
		console.log(vm.CSV);
	}

	vm.readCSV = function (input) {
	    var rows = input.split('\n');
	    var obj = [];
	    angular.forEach(rows, function(val) {
	      	var o = val.split(';');
	      	obj.push({
		        jobid: o[0],
		        userid: o[1],
		        pickuparea: o[2],
		        pickupaddress: o[3],
		        deliveryarea: o[4],
		        deliveryaddress: o[5],
		        packagedetails: o[6],
		        totalweight: o[7],
		        totalprice: o[8],
		        servicecharge: o[9],
		        notetodeliveryman : o[10]
		    });
	    });
	    return obj;
	};
}