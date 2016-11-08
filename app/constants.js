app.constant('ngAuthSettings', {
  // apiServiceBaseUri: "http://taskcatdev.azurewebsites.net/",
  apiServiceBaseUri: "http://fetchprod.gobd.co/",
  // apiServiceBaseUri: "http://localhost:23873/",
  clientId: 'GoFetchDevWebApp'
});

app.constant('menus', [
	{ 
		title : "Dashboard", 
		link: '#/',
		target : "",
		class: ""
	},
	{ 
		title : "Create Order",
		link: '#/order/create/new',
		target: "_blank",
		class: ""
	},
	{ 
		title : "Work Order",
		link: '#/workorder',
		target: "_blank",
		class: ""
	},
	{ 
		title : "Bulk Order",
		link: '#/bulkorder',
		target: "_blank",
		class: ""
	},
	{ 
		title : "Report", 
		link: '#/report',
		target : "",
		class: ""
	},
	{ 
		title : "Order Types",
		link: '#/supportedOrder',
		target: "",
		class: ""
	},
	{ 
		title : "Users", 
		link: '#/users',
		target: "",
		class: ""
	},
	{ 
		title : "Tracking Map",
		link: '#/tracking-map',
		target: "_blank",
		class: ""
	},
	{ 
		title : "Product Category",
		link: '#/products-category',
		target: "_blank",
		class: ""
	},
	{ 
		title : "Stores", 
		link: '#/stores',
		target: "",
		class: ""
	},
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


app.constant('Areas', [
	"","Outside Dhaka","Adabor","Agargaon","Azimpur","Badda","Bailey Road","Banani",
	"Banani DOHS","Banasree","Bangla Motor","Baridhara","Baridhara Block-J","Baridhara Diplomatic",
	"Baridhara DOHS","Basabo","Bashundhara","Bashundhara R/A","Bassabo","Basundhara","Cantonment",
	"Chowdhurypara","Dhanmondi","Dhanmondi R/A","DOHS","Elephant Road","Eskaton","Farmgate","Gabtoli",
	"Goran","Green road","Gulshan","Gulshan 1","Gulshan 2","Hatirpul Residential Area","Indira Road",
	"Kakrail","Kalabagan","Khilgaon","Khilgaon-taltola","Khilkhet","Lalmatia","Kallyanpur","Malibag",
	"Katabon","Malibagh","Mirpur","Mirpur 1","Mirpur 2","Mirpur DOHS","Mirpur 10","Mirpur 11","Mirpur 12",
	"Mirpur 13","Mirpur 14","Mirpur 6","Mirpur 7","Pallabi","Moghbazaar","Moghbazar","Mohakhali","Mohakhali DOHS",
	"Mohammadpur","Motijheel","Narinda","Niketan","Nikunja","Nikunja 1","Nikunja 2","Paikpara","Paltan",
	"Panthapath","Paribagh","Rajarbag","Ramna","Rampura","Segunbagicha","Shahbagh","Shahjadpur","Shantinagar",
	"Shaymoli","Shegunbagicha","Shipahibag bazar","Shyamoli","Siddeshari","Siddeshwari","Sonargaon Road","Tejgaon",
	"Tejgaon Industrial Area","Tikatuli","Tnt colony","Tongi","Uttara","Wari"
])