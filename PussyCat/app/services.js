'use strict';


angular.module('app').factory('menus', function($window) {
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

angular.module('app').factory('templates', function() {
	var templates = {
		sidebar: 'app/views/sidebar.html',
		availableAsset: 'app/views/detailsJob/availableAsset.html'
	};

    return templates;
});

angular.module('app').factory("urls", function(){
	var host = "http://localhost:23873";
	var urls = {
		index :  {
			GET: function(type,pageSize,page,envelope){
				return host + "/api/Job?"+
								"type="+ type +
								"&pageSize=" + pageSize +
								"&page="+page+
								"&envelope="+envelope;
			}
		},
		details : {
			GET : function (id) {
				return host + "/api/Job?id=" + id;
			}
		},
		asset : {
			getAsset
		}
	}
});

angular.module('app').factory('listToString', function () {
	return function (list) {
		var string = "";
		var lastItemIndex = list.length -1;
		for (var i = 0 ; i < list.length; i++) {
			string += list[i]
			console.log(list[i]);
			if (i!=lastItemIndex) {
				string += ", ";
			}
		}
		return string;
	};
});
