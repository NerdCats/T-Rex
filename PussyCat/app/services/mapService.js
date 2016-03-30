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
		var mapOptions = {
			zoom: zoom,
			center: new google.maps.LatLng(lat, lon),
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};
		var map = new google.maps.Map(document.getElementById(mapElement), mapOptions);

		var latLng = new google.maps.LatLng(23.7968725, 90.4083922);
		map.panTo(latLng);


		mapServicePrivateMap = map;
		createMarkersCallback(map);
		return map;
	};


	var createMarker = function (lat, lng, title, draggable, description, markerUrl, map) {
		var marker = new google.maps.Marker({
			  	map: map,
			  	position: new google.maps.LatLng(lat, lng),
			  	title: title,
		  	    draggable: draggable
			});
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
		var infoWindow = new google.maps.InfoWindow();
		marker.addListener('click', function(){
		  	infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
		  	infoWindow.open(map, marker);
		});
	};

	var markerDragEvent = function (marker, populateVmCallback) {
		var geocoder = new google.maps.Geocoder();
		function geocodePosition(pos, populateVmCallback) {
			geocoder.geocode({
				latLng: pos
			}, function(responses) {
				if (responses && responses.length > 0) {
					var address = responses[0].formatted_address;
					console.log(address);
					populateVmCallback(address, pos);
				} else {
					return "no address";
				}
			});
		}
		var markerDrag = function (marker) {
			var lat = marker.latLng.lat();
			var lon = marker.latLng.lng();
			console.log(lat + " " + lon);
			geocodePosition(marker.latLng, populateVmCallback);
		};

		google.maps.event.addListener(marker, 'dragend', markerDrag);

	};

	

	var getAddress = function (latLng, addressFoundCallback) {
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({
				latLng: latLng
			}, function(responses) {
				if (responses && responses.length > 0) {
					var address = responses[0].formatted_address;
					addressFoundCallback(latLng, address);
				} else {
					addressFoundCallback(latLng, address);
				}
			}
		); 
	};

	return {
		createMap : createMap,
		createMarker : createMarker,
		markerIconUri : markerIconUri,
		locateMarkerOnMap : locateMarkerOnMap,
		markerClickEvent : markerClickEvent,
		markerDragEvent : markerDragEvent,
		getAddress : getAddress
	};
}]);