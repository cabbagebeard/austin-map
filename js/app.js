function initMap() {
  var austin = {lat: 30.266568, lng: -97.743202};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    minZoom: 4,
    center: austin
  });

  var vegMarker = new google.maps.Marker({
    icon: 'img/darkgreen_MarkerV.png',
    map: map
  });
  var barMarker = new google.maps.Marker({
    icon: 'img/yellow_MarkerB.png',
    map: map
  });
  var regMarker = new google.maps.Marker({
    map: map
  });

  infoWindow = new google.maps.InfoWindow();
}


