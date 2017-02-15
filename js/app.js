var self = this;

var map;
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
      position: place.position,
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

  var places = [
  {
    position: new google.maps.LatLng(30.269565, -97.736383),
    name: "Arlo's",
    type: 'veg'
  },
  {
    position: new google.maps.LatLng(30.269693, -97.736297),
    name: "Cheer Up Charlies",
    type: 'bar'
  },
  {
    position: new google.maps.LatLng(30.683100, -98.344213),
    name: "Longhorn Cavern State Park",
    type: 'activity'
  },
  {
    position: new google.maps.LatLng(30.320741, -97.773344),
    name: "Mount Bonnell",
    type: 'activity'
  }];

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

  // FourSquare API 

  // https://api.foursquare.com/v2/venues/search
  // ?client_id=USVBGCVLFISWBVO0F13GELJFCDCWBE0HJUQ3JPYTWYX2TMET
  // &client_secret=50DVWPBMURC1SWNIJF5DMJ1K5FJITJFSAHG1KBFPQKJBCVRL
  // &v=20130815
  // &ll=40.7,-74
  // &query=sushi
      
}