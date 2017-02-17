var places = [
	{
		lat: 30.269565, 
		lng: -97.736383,
		"name": "Arlo's",
		type: 'veg'
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
	}
];

var map;
var allPlaces = [];

function initMap() {
  var austin = {lat: 30.266568, lng: -97.743202};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    minZoom: 4,
    center: austin
  });

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
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(place.lat, place.lng),
      icon: icons[place.type].icon,
      name: place.name,
      map: map
    });
    marker.addListener('click', function() {
    infoWindow.open(map, marker);
  });

  var infoWindow = new google.maps.InfoWindow({
    content: marker.name
  });
  }

  for (var i = 0, place; place = places[i]; i++) {
    addMarker(place);
  }

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
  // FourSquare API 

  // https://api.foursquare.com/v2/venues/search
  // ?client_id=USVBGCVLFISWBVO0F13GELJFCDCWBE0HJUQ3JPYTWYX2TMET
  // &client_secret=50DVWPBMURC1SWNIJF5DMJ1K5FJITJFSAHG1KBFPQKJBCVRL
  // &v=20130815
  // &ll=40.7,-74
  // &query=sushi
      

function ViewModel() {
  	var self = this;
  	self.allPlaces = ko.observableArray([]);

  	for (var i = 0, place; place = places[i]; i++) {
  		self.lat = place.lat;
  		self.lng = place.lng;
  		self.name = place.name;
  		self.type = place.type;
  		allPlaces.push(self);
  	}
}

ko.applyBindings(new ViewModel());