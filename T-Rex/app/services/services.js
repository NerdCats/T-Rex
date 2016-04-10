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

app.factory('timeAgo', function () {
	return function (creationTime) {
		creationTime = new Date(creationTime);
		var nowTime = Date.now();
		var diffInMin = (nowTime - creationTime)/1000/60;
		var time =  Math.round(diffInMin);
		return time;
	};
});

app.factory('patchUpdate', function($http, restCall, host){
	return function (value, op, path, api_path, jobId, taskId, successCallback, errorCallback) {
		var url = host + api_path + jobId + "/" + taskId;
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
});


app.factory('restCall', ['$http', 'host', function($http, host){
	return function (method, url, data, successCallback, errorCallback){
		console.log(url);
		$http({
  			method: method,
  			url : url,
  			data: data,
  			header: {
  				'Content-Type' : 'application/json'
  			} 
  		}).then(function success(response) {
  			successCallback(response);  			
  		}, function error(response) {
  			errorCallback(response);  		
  		});
	};
}]);


//app.factory('$exceptionHandler', function() {
//   return function(exception, cause) {
//     exception.message += ' (caused by "' + cause + '")';
//     console.log(exception.message);
//     // throw exception;
//   };
// });