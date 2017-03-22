var places = [
	{
		lat: 30.269565, 
		lng: -97.736383,
		name: "Arlo's",
		type: 'veg',
		marker: []
	},
	{
		lat: 30.269693, 
		lng: -97.736297,
		name: "Cheer Up Charlies",
		type: 'bar',
		marker: []
	},
	{
		lat: 30.683100, 
		lng: -98.344213,
		name: "Longhorn Cavern State Park",
		type: 'activity',
		marker: []
	},
	{
		lat: 30.320741, 
		lng: -97.773344,
		name: "Mount Bonnell",
		type: 'activity',
		marker: []
	},
	{
		lat: 30.218634, 
		lng: -97.771560,
		name: "Cathedral of Junk",
		type: 'activity',
		marker: []
	},
	{
		lat: 30.266919, 
		lng: -97.745178,
		name: "Peche",
		type: 'bar',
		marker: []
	},
	{
		lat: 30.265028, 
		lng: -97.731564,
		name: "Baton Creole",
		type: 'veg',
		marker: []
	},
	{
		lat: 30.181238, 
		lng: -97.722692,
		name: "McKinney State Park",
		type: 'campsite',
		marker: []
	},
	{
		lat: 30.369964, 
		lng: -97.721548,
		name: "Pinballz Arcade",
		type: 'activity',
		marker: []
	},
	{
		lat: 30.248428, 
		lng: -97.750338,
		name: "Uncommon Objects",
		type: 'activity',
		marker: []
	},
];
/// Custom marker icons
var iconFolder = 'img/markers/';
var icons = {
  veg: {
    name: 'Veg Restaurant',
    icon: iconFolder + 'darkgreen_MarkerV.png'
  },
  bar: {
    name: 'Bar/Brewery',
    icon: iconFolder + 'yellow_MarkerB.png'
  },
  activity: {
    name: 'Activity',
    icon: iconFolder + 'paleblue_MarkerA.png'
  },
  campsite: {
    name: 'Campsite',
    icon: iconFolder + 'brown_MarkerC.png'
  }
};

var map;
var markers = [];

function mapError() {
	alert("Something went wrong. Please try again.");
	return;
}

function initMap() {
  var austin = {lat: 30.266568, lng: -97.743202};
  /// Sets map at Austin as the center
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    minZoom: 4,
    center: austin
  });

  ko.applyBindings(new ViewModel());


/// Global infowindow variable makes it so only one is open at a time 
var infowindow = new google.maps.InfoWindow();

function addMarker(place) {
	/// FourSquare API only excepts lat and lng in the form of XX.XX
  var shortLat = place.lat.toFixed(2);
	var shortLng = place.lng.toFixed(2);

	var FourSquareURL = "https://api.foursquare.com/v2/venues/search" + 
		"?client_id=USVBGCVLFISWBVO0F13GELJFCDCWBE0HJUQ3JPYTWYX2TMET" +
		"&client_secret=50DVWPBMURC1SWNIJF5DMJ1K5FJITJFSAHG1KBFPQKJBCVRL" +
		"&v=20130815" + 
		"&ll="+ shortLat + "," + shortLng +
		"&query=" + place.name;

	/// Data Retrieval from FourSquare
	$.getJSON(FourSquareURL, function(FourSquareData) {
  		if (FourSquareData.response.venues) {
  			var currentPlace = FourSquareData.response.venues[0];
  			var currentAddress = currentPlace.location.address;	
  		}	else {
  			alert("There was an error retrieving data from FourSquare, please try again.");
  			return;
			}

		var marker = new google.maps.Marker({	
			position: new google.maps.LatLng(place.lat, place.lng),
			icon: icons[place.type].icon,
			name: place.name,
			address: currentAddress,
			animation: google.maps.Animation.DROP,
			map: map,
		});		

		/// Opens infowindow on click
		marker.addListener('click', function() {
			map.setCenter(marker.position);
			infowindow.setContent(marker.name + '<br>' + marker.address);
			infowindow.open(map, marker);
		});

		/// Marker Bounce
		marker.addListener('click', function() {
			if (marker.getAnimation() !== null) {
    			marker.setAnimation(null);
  			} else {
    			marker.setAnimation(google.maps.Animation.BOUNCE);
    			    setTimeout(function() {
				      marker.setAnimation(null);
				    }, 700);
  			}
		});

		function visible(bool) {
			if (bool === true) {
				marker.setVisible(true);
			} else {
				marker.setVisible(false);
			}
		}

		markers.push(marker);
		place.marker.push(marker);
  }); 		
 }
  /// Adds the markers
	for (var i = 0, place; place = places[i]; i++) {
		addMarker(place);
	}
}

var Place = function(data) {
	this.lat = data.lat;
	this.lng = data.lng;
	this.name = data.name;
	this.type = data.type;
	this.marker = data.marker;
};	

function ViewModel() {

	var self = this;

	self.placesList = ko.observableArray([]);
	self.filter = ko.observable('');

	places.forEach(function(placeItem) {
		self.placesList.push( new Place(placeItem) );
	});

	/// Returns places that match user's input in search bar
	/// Hides markers that don't fit search, shows markers that do
	self.filteredPlaces = ko.computed(function() {
    return ko.utils.arrayFilter(self.placesList(), function(place) {
    	place.marker[0] && place.marker[0].setVisible(false);
    	if (place.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1) {
    		place.marker[0] && place.marker[0].setVisible(true);
    		return place.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1;
    	}
    });
  }, self);
}

function clickedPlace(place) {
	google.maps.event.trigger(place.marker[0], 'click');
}