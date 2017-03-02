var places = [
	{
		lat: 30.269565, 
		lng: -97.736383,
		name: "Arlo's",
		type: 'veg',
	},
	{
		lat: 30.269693, 
		lng: -97.736297,
		name: "Cheer Up Charlies",
		type: 'bar'
	},
	{
		lat: 30.683100, 
		lng: -98.344213,
		name: "Longhorn Cavern State Park",
		type: 'activity'
	},
	{
		lat: 30.320741, 
		lng: -97.773344,
		name: "Mount Bonnell",
		type: 'activity'
	},
	{
		lat: 30.218634, 
		lng: -97.771560,
		name: "Cathedral of Junk",
		type: 'activity'
	},
	{
		lat: 30.266919, 
		lng: -97.745178,
		name: "Peche",
		type: 'bar'
	},
	{
		lat: 30.265028, 
		lng: -97.731564,
		name: "Baton Creole",
		type: 'veg'
	},
	{
		lat: 30.181238, 
		lng: -97.722692,
		name: "McKinney State Park",
		type: 'campsite'
	},
	{
		lat: 30.369964, 
		lng: -97.721548,
		name: "Pinballz Arcade",
		type: 'activity'
	},
	{
		lat: 30.248428, 
		lng: -97.750338,
		name: "Uncommon Objects",
		type: 'activity'
	},
];

var map;

function initMap() {
  var austin = {lat: 30.266568, lng: -97.743202};
  /// Sets map at Austin as the center
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    minZoom: 4,
    center: austin
  });

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
  		}	
		var marker = new google.maps.Marker({	
			position: new google.maps.LatLng(place.lat, place.lng),
			icon: icons[place.type].icon,
			name: place.name,
			address: currentAddress,
			infoOpen: false,
			animation: google.maps.Animation.DROP,
			map: map
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
		})
		/// Zooms, centers, and opens Info Window on clicked marker
		var centerMarker = marker.addListener('click', function() {		
			map.setZoom(16);
			map.setCenter(marker.position);
			if (marker.infoOpen == false) {
				infoWindow.open(map, marker);
				marker.infoOpen = true;
			}
			else if (marker.infoOpen) {
				infoWindow.close();
				marker.infoOpen = false;
			}			
		});
		var infoWindow = new google.maps.InfoWindow({
			content: marker.name + "<br>" + marker.address
		});
  	})
  }

  	/// Adds the markers
	for (var i = 0, place; place = places[i]; i++) {
		addMarker(place);
	}
	/// Creates the Legend
	var legend = document.getElementById('legend');
	for (var key in icons) {
		var type = icons[key];
		var name = type.name;
		var icon = type.icon;
		var div = document.createElement('div');
		div.innerHTML = '<img src="' + icon + '">' + name;
		legend.appendChild(div);
	}
	map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
	}

var Place = function(data) {
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.name = ko.observable(data.name);
	this.type = ko.observable(data.type);	
} 

function ViewModel() {
	var self = this;

	self.placesList = ko.observableArray([]);
	self.filter = ko.observable('');

	places.forEach(function(placeItem) {
		self.placesList.push( new Place(placeItem) );
	});

	/// Returns places that match user's input in search bar
	self.filteredPlaces = ko.computed(function() {
        return ko.utils.arrayFilter(self.placesList(), function(place) {
        	if (place.name().toLowerCase().indexOf(self.filter().toLowerCase()) !== -1) {
        		return place.name().toLowerCase().indexOf(self.filter().toLowerCase()) !== -1;
        	}
        });
      }, self);
}

ko.applyBindings(new ViewModel());
