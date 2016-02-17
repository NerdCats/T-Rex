'use strict';


app.factory('menus', function($window) {
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

app.factory('templates', function() {
	var templates = {
	 	sidebar: 'partials/sidebar.html',
      	availableAsset: 'partials/detailsJob/availableAsset.html'
    };

    return templates;
});

app.factory("urls", function(){
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
})
