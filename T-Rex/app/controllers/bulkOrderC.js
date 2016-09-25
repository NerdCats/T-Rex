// FIXME: someday, you should use http://oss.sheetjs.com/js-xlsx/

app.controller('bulkOrderC', ['$scope', bulkOrderC]);

function bulkOrderC ($scope) {
	
	var vm = $scope;
	
	document.getElementById('csv').addEventListener('change', handleFile, false);
	function handleFile (e) {		
		var files = e.target.files;
		var f = files[0];
		console.log(f)

		 var r = new FileReader();
          r.onload = function(e) {
              var contents = e.target.result;              
              vm.CSV = vm.readCSV(contents);
              vm.$apply();
              console.log(vm.CSV);
          };
          r.readAsText(files[0]);
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
		        notetodeliveryman : o[10],
		        editMode: false,
		        createOrder: function () {
		        	
		        }
		    });
	    });
	    return obj;
	};
}