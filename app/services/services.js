(function () {
	'use strict';
	app.factory('listToString', function () {
		return function (list) {
			var string = "";
			if (list!=null) {
				var lastItemIndex = list.length -1;
				for (var i = 0 ; i < list.length; i++) {
					string += list[i]			
					if (i!=lastItemIndex) {
						string += ", ";
					}
				}			
			}
			return string;
		};
	});
})();


(function () {
	'use strict';
	app.factory('timeAgo', function () {
		return function (creationTime) {
			creationTime = new Date(creationTime);
			var nowTime = Date.now();
			var diffInMin = (nowTime - creationTime)/1000/60;
			var timeElapsed = Math.round(diffInMin/60);
			if (timeElapsed > 6) {
				return timeElapsed;
			} else {
				return null;				
			}
		};
	});	
})();


(function () {
	'use strict';
	app.factory('patchUpdate', patchUpdate);
	function patchUpdate($http, restCall, ngAuthSettings){
		return function (value, op, path, api_path, jobId, taskId, successCallback, errorCallback) {
			var url = ngAuthSettings.apiServiceBaseUri + api_path + jobId + "/" + taskId;
			console.log(url);
			var data = [
				    {
				      value: value,
				      path: path,
				      op: op
				    }
				];
			console.log(data);
			restCall('PATCH', url, data, successCallback, errorCallback);
		};
	}
})();


(function () {
	'use strict';
	app.factory('restCall', restCall);
	function restCall($http){
		return function (method, url, data, successCallback, errorCallback){				
			$http({
	  			method: method,
	  			url : url,
	  			data: data
	  		}).then(function success(response) {
	  			successCallback(response);
	  		}, function error(response) {
	  			errorCallback(response);
	  		});
		};
	}
})();


// (function () {
	//app.factory('$exceptionHandler', function() {
	//   return function(exception, cause) {
	//     exception.message += ' (caused by "' + cause + '")';
	//     console.log(exception.message);
	//     // throw exception;
	//   };
	// });
// })();