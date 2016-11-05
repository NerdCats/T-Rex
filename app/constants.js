app.constant('ngAuthSettings', {
  // apiServiceBaseUri: "http://taskcatdev.azurewebsites.net/",
  apiServiceBaseUri: "http://fetchprod.gobd.co/",
  // apiServiceBaseUri: "http://localhost:23873/",
  clientId: 'GoFetchDevWebApp'
});

app.constant('menus', [
	{ title : "Dashboard", link: '#/'},
	{ title : "Create Order", link: '#/order/create/new', target: "_blank"},
	{ title : "Work Order", link: '#/workorder', target: "_blank"},
	{ title : "Bulk Order", link: '#/bulkorder', target: "_blank"},
	{ title : "Report", link: '#/report'},
	{ title : "Order Types", link: '#/supportedOrder'},
	{ title : "Users", link: '#/users'},
	{ title : "Tracking Map", link: '#/tracking-map', target: "_blank"},
	{ title : "Product Category", link: '#/products-category', target: "_blank"},
	{ title : "Stores", link: '#/stores'},
]);


app.constant('tracking_host', "http://gofetch.cloudapp.net:1337/");
app.constant('signlr_link', "http://gofetch.cloudapp.net:1001/signalr/hubs");
app.constant('jobNotification_link', "http://gofetch.cloudapp.net:1002/signalr/hubs")
app.constant('reportServiceUrl', "http://gobdsif.cloudapp.net/");
// app.constant('reportServiceUrl', "http://127.0.0.1/");



app.constant('templates', {
	sidebar: 'app/views/sidebar.html',
	availableAsset: 'app/views/detailsJob/availableAsset.html'
});

app.constant('COLOR', {
	"red" : "#F44336",
	"green" : "#4CAF50",
	"yellow" : "#FFEB3B"
});
