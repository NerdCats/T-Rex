'use strict';

app.factory('listToString', function () {
	return function (list) {
		var string = "";
		var lastItemIndex = list.length -1;
		for (var i = 0 ; i < list.length; i++) {
			string += list[i]			
			if (i!=lastItemIndex) {
				string += ", ";
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

app.factory('patchUpdate', function($http){
	return function (value, path, op, jobId, taskId, successCallback, errorCallback) {
		var url = 'http://localhost:23873/api/Job/' + jobId + "/" + taskId;
		var data = [
			    {
			      value: value,
			      path: path,
			      op: op
			    }
			];
		console.log(data);
		$http({
  			method: 'PATCH',
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
});








angular.module('app').factory('menus', function() {
	//menu options
	var menus = [
		{ Title : "Dashboard", Href: '#/'},
		{ Title : "Orders", Href: '#/'},
		{ Title : "Users", Href: '#/'},
		{ Title : "Assets", Href: '#/asset'},
		{ Title : "Agents", Href: '#/'},
		{ Title : "Administration", Href: '#/'}
	];

	return menus;
});

angular.module('app').factory('markerIconUri', function () {
	var markerIconUri = {
		blueMarker : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
		redMarker : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
		purpleMarker : "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
		yellowMarker : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
		greenMarker : "http://maps.google.com/mapfiles/ms/icons/green-dot.png"		
	};
	return markerIconUri;
})

angular.module('app').factory('templates', function() {
	var templates = {
		sidebar: 'app/views/sidebar.html',
		availableAsset: 'app/views/detailsJob/availableAsset.html'
	};

    return templates;
});
//app.factory('$exceptionHandler', function() {
//   return function(exception, cause) {
//     exception.message += ' (caused by "' + cause + '")';
//     console.log(exception.message);
//     // throw exception;
//   };
// });