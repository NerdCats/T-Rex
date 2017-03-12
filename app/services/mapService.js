(function () {
	'use strict';
	
	app.service('mapFactory', 

	function mapFactory(){
		
		var mapServicePrivateMap;
		var privatePickUpOverLay;
		var privatePeliveryOverLay;
		var markerIconUri = {
			blueMarker : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
			redMarker : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
			purpleMarker : "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
			yellowMarker : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
			greenMarker : "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
			destination : "/content/img/ic_destination1.png",
			start : "/content/img/ic_start1.png"	
		};

		var createMap = function (lat, lon, mapElement, zoom) {
			mapServicePrivateMap = new GMaps({
				el: '#'+ mapElement,
				lat: lat,
				lng: lon,
				zoom: zoom,
				mapTypeId: google.maps.MapTypeId.TERRAIN
		    });

			var latLng = new google.maps.LatLng(23.7968725, 90.4083922);
			mapServicePrivateMap.panTo(latLng);		
			google.maps.event.trigger(mapServicePrivateMap, 'resize');
			return mapServicePrivateMap;
		};


		var createMarker = function (lat, lng, title, draggable, description, markerUrl, map) {
			if (map==null) {
				map = mapServicePrivateMap;
			};

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

		var createOverlay = function (lat, lng, content, verticalAlign, horizontalAlign) {
	 		var overLay = mapServicePrivateMap.drawOverlay({
											lat: lat,
											lng: lng,							
											content: '<div class="overlay">'+ content + '<div class="overlay_arrow above"></div></div>',
											verticalAlign: 'top',
									        horizontalAlign: 'center'
										});		
	 		return overLay;
	 	};

	 	var removeOverlays = function () {
	 		mapServicePrivateMap.removeOverlays();
	 	};

		var locateMarkerOnMap = function (value) {
			if (!isNaN(value.lat) || !isNaN(value.lng)) {
				var latLng = new google.maps.LatLng(value.lat, value.lng);			
				mapServicePrivateMap.panTo(latLng);
				mapServicePrivateMap.setZoom(16);
			}
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
				markerAddressFoundCallback(lat, lng);
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


		var searchBox = function (placeTobeSearched, getPlacesResultCallback) {	
			var googleMapsService = new google.maps.places.AutocompleteService();
				googleMapsService.getPlacePredictions({
		          input: placeTobeSearched
		        }, getPlacesResultCallback);		
		};

		var setCenterByAddress = function (address, getCurrentMarkerLocationCallback) {
			var map = mapServicePrivateMap;
		    GMaps.geocode({
				address: address,
				callback: function(results, status) {
					if (status == 'OK') {
						var latlng = results[0].geometry.location;
						var lat = latlng.lat();
						var lng = latlng.lng()

						getCurrentMarkerLocationCallback(lat, lng)
						map.setCenter(lat, lng);
						map.setZoom(17);
						map.removeMarkers();
						var currentMarker = map.addMarker({
							lat: latlng.lat(),
							lng: latlng.lng(),
							draggable : true
						});
						markerDragEvent(currentMarker, getCurrentMarkerLocationCallback);
					}
				}
			});
		}

	 	

		var mapContextMenuForCreateOrder = function (setFromLocationCallback, setToLocationCallback) {
			var map = mapServicePrivateMap;
			map.setContextMenu({
				control: 'map',
				options: [
					{
						title: 'Add Pickup Location',
						name: 'Pickup',
						action: function(e) {
							var lat = e.latLng.lat();
							var lng = e.latLng.lng();
							var content = 'Pickup';
							mapServicePrivateMap.removeOverlay(privatePickUpOverLay);
							setFromLocationCallback(lat, lng);
							privatePickUpOverLay = createOverlay(lat, lng, content);
						}
					}, 
					{
						title: 'Add Delivery Location',
						name: 'Delivery',
						action: function(e) {
							var lat = e.latLng.lat();
							var lng = e.latLng.lng();
							var content = 'Delivery';
							mapServicePrivateMap.removeOverlay(privatePeliveryOverLay);
							setToLocationCallback(lat, lng);
							privatePeliveryOverLay = createOverlay(lat, lng, content);						
						}
					}
				]
			});
		};

		this.createMap = createMap;
		this.createMarker = createMarker;
		this.createOverlay = createOverlay;
		this.removeOverlays = removeOverlays;
		this.markerIconUri = markerIconUri;
		this.locateMarkerOnMap = locateMarkerOnMap;
		this.markerClickEvent = markerClickEvent;
		this.markerDragEvent = markerDragEvent;
		this.getAddress = getAddress;
		this.searchBox = searchBox;
		this.setCenterByAddress = setCenterByAddress;
		this.mapContextMenuForCreateOrder = mapContextMenuForCreateOrder;	
	});	
})();