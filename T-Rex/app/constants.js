app.constant('ngAuthSettings', {
  // apiServiceBaseUri: "http://taskcatdev.azurewebsites.net/",
  apiServiceBaseUri: "http://gofetch.cloudapp.net:80/",
  // apiServiceBaseUri: "http://localhost:23873/",
  clientId: 'GoFetchDevWebApp'
});

app.constant('menus', [
	{ title : "Dashboard", link: '#/'},
	{ title : "Create Order", link: '#/order/create/new', target: "_blank"},
	{ title : "Report", link: '#/report'},
	{ title : "Order Types", link: '#/supportedOrder'},
	{ title : "Users", link: '#/users'},
	{ title : "Tracking Map", link: '#/tracking-map', target: "_blank"},
	// { Title : "Agents", Href: '#/'},
	// { Title : "Administration", Href: '#/'}
]);


app.constant('tracking_host', "http://gofetch.cloudapp.net:1337/");
app.constant('reportServiceUrl', "http://gobdsif.cloudapp.net/");
app.constant('signlr_link', "http://gofetch.cloudapp.net:1001/signalr/hubs");


app.constant('templates', {
	sidebar: 'app/views/sidebar.html',
	availableAsset: 'app/views/detailsJob/availableAsset.html'
});

app.constant('COLOR', {
	"red" : "#F44336",
	"green" : "#4CAF50",
	"yellow" : "#FFEB3B"

});
