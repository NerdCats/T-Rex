'use strict';


app.factory('menus', function($window) {
	//menu options
	var menus = [
		{Title : "Dashboard",  Navigate: function(){$window.location.href = '/index.html'}},
		{Title : "Orders",  Navigate: function(){$window.location.href = '/index.html'}},
		{Title : "Users",  Navigate: function(){$window.location.href = '/index.html'}},
		{Title : "Assets",  Navigate: function(){$window.location.href = '/asset.html'}},
		{Title : "Agents",  Navigate: function(){$window.location.href = '/index.html'}},
		{Title : "Administration",  Navigate: function(){$window.location.href = '/index.html'}}
	];

	return menus;
});

app.factory('templates', function() {
	var templates = [ 
	 	{ name: 'sidebar.html', url: 'template/sidebar.html'},
      	{ name: 'template2.html', url: 'template2.html'} 
    ];

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
