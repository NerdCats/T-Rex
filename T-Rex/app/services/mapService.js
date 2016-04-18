app.factory('mapFactory', [function(){
	
	var mapServicePrivateMap;
	var markerIconUri = {
		blueMarker : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
		redMarker : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
		purpleMarker : "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
		yellowMarker : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
		greenMarker : "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
		destination : "/content/img/ic_destination1.png",
		start : "/content/img/ic_start1.png"	
	};

	var createMap = function (lat, lon, mapElement, zoom, createMarkersCallback) {
		// var mapOptions = {
		// 	zoom: zoom,
		// 	center: new google.maps.LatLng(lat, lon),
		// 	mapTypeId: google.maps.MapTypeId.TERRAIN
		// };
		// var map = new google.maps.Map(document.getElementById(mapElement), mapOptions);

		var map = new GMaps({
			el: '#'+ mapElement,
			lat: lat,
			lng: lon,
			zoom: zoom,
			mapTypeId: google.maps.MapTypeId.TERRAIN
	    });

		var latLng = new google.maps.LatLng(23.7968725, 90.4083922);
		map.panTo(latLng);


		mapServicePrivateMap = map;
		createMarkersCallback(map);
		google.maps.event.trigger(map, 'resize');
		return map;
	};


	var createMarker = function (lat, lng, title, draggable, description, markerUrl, map) {
		if (map==null) {
			map = mapServicePrivateMap;
		};

		// var marker = new google.maps.Marker({
		// 	  	map: map,
		// 	  	position: new google.maps.LatLng(lat, lng),
		// 	  	title: title,
		//   	    draggable: draggable
		// 	});
		var marker = map.addMarker({
			  	map: map,
			  	position: new google.maps.LatLng(lat, lng),
			  	title: title,
		  	    draggable: draggable
		})
		marker.setIcon(markerUrl);
		marker.content = '<div class="infoWindowContent">' + description + '</div>';
		return marker;
	};

	var locateMarkerOnMap = function (value) {
			var latLng = new google.maps.LatLng(value.lat, value.lon);
			console.log("latLng");
			console.log(latLng);
			console.log(value);
			mapServicePrivateMap.panTo(latLng);
	}

	var markerClickEvent = function (map, marker) {
		if (map==null) {
			map = mapServicePrivateMap;
		};
		var infoWindow = new google.maps.InfoWindow();
		marker.addListener('click', function(){
		  	infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
		  	infoWindow.open(map, marker);
		});
	};

	var markerDragEvent = function (marker, markerAddressFoundCallback) {
		var geocoder = new google.maps.Geocoder();
		var markerDrag = function (marker) {
			var lat = marker.latLng.lat();
			var lng = marker.latLng.lng();
			console.log(lat + " " + lng);		
			getAddress(lat, lng, markerAddressFoundCallback)
		};
		google.maps.event.addListener(marker, 'dragend', markerDrag);

	};

	var getAddress = function (lat, lng, addressFoundCallback) {
		var latLng = new google.maps.LatLng(lat, lng);
		console.log(latLng)
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({
				latLng: latLng
			}, function(responses) {
				if (responses && responses.length > 0) {
					var address = responses[0].formatted_address;
					addressFoundCallback(address, latLng);
				} else {
					addressFoundCallback(address, latLng);
				}
			}
		); 
	};


	var searchBox = function (searchBoxId) {	
				
		var map = mapServicePrivateMap;
	    GMaps.geocode({
			address: $(searchBoxId).val(),
			callback: function(results, status) {
				if (status == 'OK') {
					var latlng = results[0].geometry.location;
					map.setCenter(latlng.lat(), latlng.lng());
					map.addMarker({
						lat: latlng.lat(),
						lng: latlng.lng()
					});
				}
			}
		});
	};

 
	var mapContextMenuForCreateOrder = function () {
		var map = mapServicePrivateMap;
		map.setContextMenu({
			control: 'map',
			options: [
				{
					title: 'Add Pickup Location',
					name: 'Pickup',
					action: function(e) {
						mapServicePrivateMap.addMarker({
							lat: e.latLng.lat(),
							lng: e.latLng.lng(),
							title: 'New marker',
							icon : markerIconUri.start
						});
					}
				}, 
				{
					title: 'Add Delivery Location',
					name: 'Delivery',
					action: function(e) {
						mapServicePrivateMap.addMarker({
							lat: e.latLng.lat(),
							lng: e.latLng.lng(),
							title: 'New marker',
							icon : markerIconUri.destination
						});
					}
				}
			]
		});
	};


	



	return {
		createMap : createMap,
		createMarker : createMarker,
		markerIconUri : markerIconUri,
		locateMarkerOnMap : locateMarkerOnMap,
		markerClickEvent : markerClickEvent,
		markerDragEvent : markerDragEvent,
		getAddress : getAddress,
		searchBox : searchBox,
		mapContextMenuForCreateOrder : mapContextMenuForCreateOrder
	};
}]);