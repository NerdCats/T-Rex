app.factory('mapFactory', [function(){
	
	var markerIconUri = {
		blueMarker : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
		redMarker : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
		purpleMarker : "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
		yellowMarker : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
		greenMarker : "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
		destination : "/content/img/ic_destination1.png",
		start : "/content/img/ic_start1.png"	
	};

	var createMap = function (lat, lon, mapElement, map, zoom, createMarkersCallback) {
		var mapOptions = {
			zoom: zoom,
			center: new google.maps.LatLng(lat, lon),
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};
		map = new google.maps.Map(document.getElementById(mapElement), mapOptions);
		createMarkersCallback(map);
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

	}

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
		markerClickEvent : markerClickEvent,
		markerDragEvent : markerDragEvent,
		getAddress : getAddress
	};
}]);