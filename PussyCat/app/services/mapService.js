app.factory('mapFactory', [function(){
	
	var markerIconUri = {
		blueMarker : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
		redMarker : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
		purpleMarker : "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
		yellowMarker : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
		greenMarker : "http://maps.google.com/mapfiles/ms/icons/green-dot.png"		
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


	var createMarker = function (lat, lng, title, description, markerUrl, map, markers) {
		var marker = new google.maps.Marker({
			  	map: map,
			  	position: new google.maps.LatLng(lat, lng),
			  	title: title
			});
		marker.setIcon(markerUrl);
		marker.content = '<div class="infoWindowContent">' + description + '</div>';
		marker.addListener('click', toggleBounce);

		function toggleBounce() {
		  if (marker.getAnimation() !== null) {
		    marker.setAnimation(null);
		  } else {
		    marker.setAnimation(google.maps.Animation.BOUNCE);
		  }
		}

		var infoWindow = new google.maps.InfoWindow();
		google.maps.event.addListener(marker, 'click', function(){
		  	infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
		  	infoWindow.open(map, marker);
		});
		markers.push(marker);
		console.log(markers)
	};

	return {
		createMap : createMap,
		createMarker : createMarker,
		markerIconUri : markerIconUri
	};
}])